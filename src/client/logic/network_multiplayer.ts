import { Accessor, batch, createSignal, Setter } from "solid-js"
import { createStore, produce, SetStoreFunction } from "solid-js/store"
import {
  calculatePlayableSpots,
  canBeQueen,
  findKilled,
} from "../../common/board_math"
import {
  CheckerboardPiece,
  CheckerboardPieceIdentity,
  piecesToMap,
  PlayerType,
} from "../../common/models"
import { LOBBY_HEADER, readPacket } from "../../common/network/network"
import { InitialHandshakePacket, Packet } from "../../common/network/packet"
import { IMultiplayerCore } from "./multiplayer"

type PieceType = Record<CheckerboardPieceIdentity, CheckerboardPiece>
type PartialPieceType = Partial<PieceType>

export class NetworkMultiplayer implements IMultiplayerCore {
  private readonly turn: Accessor<PlayerType>
  private readonly setTurn: Setter<PlayerType>
  private readonly pieces: Readonly<PieceType>
  private readonly setPieces: SetStoreFunction<PartialPieceType>

  public readonly width: Accessor<number>
  public readonly height: Accessor<number>

  private readonly setWidth: Setter<number>
  private readonly setHeight: Setter<number>

  public readonly spectating: Accessor<boolean>
  public readonly playerType: Accessor<PlayerType>

  private readonly setSpectating: Setter<boolean>
  private readonly setPlayerType: Setter<number>

  public readonly setup: Accessor<boolean>
  private readonly setSetup: Setter<boolean>

  private uuid: number = 0

  private socket!: WebSocket

  constructor(lobbyID: number) {
    const [p, sP] = createStore<PieceType>({})
    const [t, setT] = createSignal<PlayerType>(0)

    const [w, setW] = createSignal<number>(0)
    const [h, setH] = createSignal<number>(0)

    const [spectating, setSpectating] = createSignal(false)
    const [playerType, setPlayerType] = createSignal<PlayerType>(0)

    const [setup, setSetup] = createSignal(false)

    this.setup = setup
    this.setSetup = setSetup

    this.width = w
    this.setWidth = setW

    this.height = h
    this.setHeight = setH

    this.turn = t
    this.setTurn = setT

    this.pieces = p
    this.setPieces = sP as SetStoreFunction<PartialPieceType>

    this.spectating = spectating
    this.setSpectating = setSpectating

    this.playerType = playerType
    this.setPlayerType = setPlayerType

    this.socket = new WebSocket(
      `ws://${window.location.hostname}:${window.location.port}/api`
    )

    this.socket.addEventListener("open", () => {
      console.log("Connected to websocket, joining lobby!")
      const packet: InitialHandshakePacket = {
        lobbyID: lobbyID,
      }
      this.socket.send(JSON.stringify(packet))
    })
    this.socket.addEventListener("message", (e) => this.handlePacket(e.data))
  }
  get canTakeTurn(): Accessor<boolean> {
    return () => this.whosTurn() === this.playerType()
  }

  handlePacket(data: any) {
    const packet = readPacket(data as string)

    batch(() => {
      if (packet.serverError) {
        console.error("Server responded with error!", packet.serverError.error)
      }

      if (packet.sessionData) {
        this.setWidth(packet.sessionData.width)
        this.setHeight(packet.sessionData.height)
        this.setHeight(packet.sessionData.height)
        this.setPlayerType(packet.sessionData.player)
        this.setSpectating(packet.sessionData.spectating)
        this.setPieces(piecesToMap(packet.sessionData.pieces))
        this.uuid = packet.sessionData.yourUUID

        this.setSetup(true)

        console.log("session data", {
          player: this.playerType(),
          spectating: this.spectating(),
        })
      }

      if (packet.pieceKilled) {
        this.kill(packet.pieceKilled.uuid)
      }

      if (packet.changeTurn) {
        this.setTurn(packet.changeTurn.newTurn)
      }

      if (packet.pieceMoved) {
        this.moveToSquare(packet.pieceMoved.uuid, packet.pieceMoved.newPosition)
      }

      if (packet.pieceQueen) {
        this.makeQueen(packet.pieceQueen.uuid)
      }
    })
  }

  sendPacket<K extends keyof Packet, T extends Packet[K]>(key: K, packet: T) {
    this.socket.send(
      JSON.stringify({
        [key]: packet,
      })
    )
  }

  getPieces(player?: PlayerType | undefined): Readonly<CheckerboardPiece[]> {
    if (!player) return Object.values(this.pieces)

    return Object.values(this.pieces).filter((p) => p.player === player)
  }

  pieceAtLocation(square: number): CheckerboardPiece | null {
    return this.getPieces().find((e) => e.position === square) ?? null
  }

  get whosTurn(): Accessor<PlayerType> {
    return () => this.turn()
  }
  local(): boolean {
    return false
  }

  takeTurn(piece: CheckerboardPiece, square: number): void {
    this.sendPacket("pieceMoved", {
      uuid: piece.uuid,
      newPosition: square,
    })
  }

  kill(piece: CheckerboardPieceIdentity) {
    this.setPieces(piece, undefined)
  }

  moveToSquare(piece: CheckerboardPieceIdentity, newPosition: number) {
    this.setPieces(piece, (p) => ({
      ...p,
      position: newPosition,
    }))
  }

  makeQueen(uuid: number) {
    this.setPieces(uuid, (p) => ({
      ...p,
      queen: true,
    }))
  }

  playablePositions(piece: CheckerboardPiece): Generator<number> {
    return calculatePlayableSpots(
      piece,
      this.width(),
      this.height(),
      Object.values(this.pieces)
    )
  }
}

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

  private uuid: number = 0

  private readonly socket: WebSocket

  constructor(lobbyID: number) {
    const [p, sP] = createStore<PieceType>({})
    const [t, setT] = createSignal<PlayerType>(0)

    const [w, setW] = createSignal<number>(0)
    const [h, setH] = createSignal<number>(0)

    const [spectating, setSpectating] = createSignal(false)
    const [playerType, setPlayerType] = createSignal<PlayerType>(0)

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

    this.socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/api`)
    this.socket.addEventListener("open", () => {
      console.log("Connected to websocket, joining lobby!")
      const packet: InitialHandshakePacket = {
        lobbyID: lobbyID,
      }
      this.socket.send(JSON.stringify(packet))
    })
    this.socket.addEventListener("message", (e) => this.handlePacket(e.data))
  }

  handlePacket(data: any) {
    const packet = readPacket(data as string)

    batch(() => {
      if (packet.sessionData) {
        this.setWidth(packet.sessionData.width)
        this.setHeight(packet.sessionData.height)
        this.setHeight(packet.sessionData.height)
        this.setPlayerType(packet.sessionData.player)
        this.setSpectating(packet.sessionData.spectating)
        this.uuid = packet.sessionData.yourUUID
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

  whosTurn(): PlayerType {
    return this.turn()
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

import ws from "ws"
import {
  calculatePlayableSpots,
  canBeQueen,
  findKilled,
  playerPieces,
} from "../common/board_math"
import {
  CheckerboardPieceIdentity,
  CheckerboardPiece,
  PlayerType,
  piecesToMap,
} from "../common/models"
import { readPacket, writeToPlayer } from "../common/network/network"
import { Packet } from "../common/network/packet"
import { removeSession } from "./game_controller"
import { IPlayer } from "./player"

const decoder = new TextDecoder("utf-8")

export class GameSession {
  private turn: PlayerType = 0

  constructor(
    private readonly id: number,
    public width: number,
    public height: number,
    public readonly players: IPlayer[]
  ) {
    players.find((e) => e.player === 0 && !e.spectating)!.pieces = piecesToMap([
      ...playerPieces(width, height, 0, false),
    ])
    players.find((e) => e.player === 1 && !e.spectating)!.pieces = piecesToMap([
      ...playerPieces(width, height, 1, true),
    ])

    players.forEach((p) => this.setupPlayer(p))
  }

  private setupPlayer(player: IPlayer) {
    player.socket.addEventListener("close", () =>
      this.clientDisconnected(player)
    )

    if (player.socket.readyState != ws.OPEN) {
      player.socket.addEventListener("open", () => this.sendSessionData(player))
    } else {
      this.sendSessionData(player)
    }

    player.socket.addEventListener("message", (ev) =>
      this.handlePacket(
        player,
        ev.data as string //decoder.decode(new Uint8Array(ev.data))
      )
    )
  }

  private checkGameOver() {
    const player0 = this.players.find(
      (e) => !e.spectating && e.player === 0
    )?.pieces

    const player1 = this.players.find(
      (e) => !e.spectating && e.player === 1
    )?.pieces

    if (
      player0 &&
      player1 &&
      Object.values(player0).length !== 0 &&
      Object.values(player1).length !== 0
    ) {
      return
    }

    console.log("Game over!")
    this.sendPacketToAll("sessionClosed", {
      winner: Object.values(player0 ?? []).length === 0 ? 1 : 0,
    })
    this.players.forEach((e) => e.socket.terminate())
    removeSession(this.id)
  }

  handlePacket(player: IPlayer, data: string) {
    const packet = readPacket(data)

    try {
      if (packet.sessionData === null) {
        this.sendSessionData(player)
      }

      if (player.spectating) {
        return
      }

      if (packet.pieceMoved) {
        this.takeTurn(
          packet.pieceMoved.uuid,
          packet.pieceMoved.newPosition,
          player
        )
      }
    } catch (e) {
      writeToPlayer(player, "serverError", {
        error: `${e}`,
      })
    }
  }

  addSpectator(spectator: IPlayer) {
    spectator.spectating = true
    this.setupPlayer(spectator)
  }

  sendPacketToAll<K extends keyof Packet, T extends Packet[K]>(
    key: K,
    packet: T
  ) {
    writeToPlayer(this.players, key, packet)
  }

  clientDisconnected(player: IPlayer) {
    if (player.spectating) return

    this.players.forEach((e) => {
      if (e.socket.readyState != ws.OPEN) return

      e.socket.close()
    })

    removeSession(this.id)
  }

  kill(piece: CheckerboardPieceIdentity) {
    const player = this.players.find((e) => Object.hasOwn(e.pieces, piece))

    if (!player || player.spectating) return
    delete player.pieces[piece]

    this.sendPacketToAll("pieceKilled", {
      uuid: piece,
    })
  }

  getPlayersPieces(player: IPlayer) {
    return Object.values(player.pieces)
  }

  takeTurn(
    pieceUUID: CheckerboardPieceIdentity,
    newPosition: number,
    player: IPlayer
  ) {
    const piece = player.pieces[pieceUUID]

    if (!piece)
      throw `Piece with uuid ${pieceUUID} not found for player ${player.player}!`
    if (piece.player !== this.turn) throw "Wrong player taking turn!"

    const pieces = this.players.flatMap((e) => Object.values(e.pieces))

    if (
      !Array.from(
        calculatePlayableSpots(piece, this.width, this.height, pieces)
      ).some((e) => e === newPosition)
    )
      throw `Not a valid playable position! ${piece.position} to ${newPosition}`

    const killedPos = findKilled(piece.position, newPosition, this.width)
    const killed = pieces.find((e) => e.position === killedPos)

    if (killed) {
      this.kill(killed.uuid)
    }

    this.turn = this.turn === 0 ? 1 : 0

    this.moveSquare(piece, newPosition)
    this.makeQueen(piece)

    this.sendPacketToAll("changeTurn", {
      newTurn: this.turn,
    })
    this.checkGameOver()
  }
  makeQueen(piece: CheckerboardPiece) {
    const queen =
      piece.queen ||
      canBeQueen(piece.player, piece.position, this.width, this.height)

    if (piece.queen != queen) {
      piece.queen = queen
      this.sendPacketToAll("pieceQueen", {
        uuid: piece.uuid,
      })
    }
  }

  private moveSquare(piece: CheckerboardPiece, newPosition: number) {
    piece.position = newPosition

    this.sendPacketToAll("pieceMoved", {
      uuid: piece.uuid,
      newPosition: newPosition,
    })
  }

  sendSessionData(player?: IPlayer) {
    const packet = {
      width: this.width,
      height: this.height,
      pieces: this.players.flatMap((e) => Object.values(e.pieces)),
    }

    if (player) {
      writeToPlayer(player, "sessionData", {
        ...packet,
        yourUUID: player.uuid,
        player: player.player ?? 0,
        spectating: player.spectating,
      })
    } else {
      this.players.forEach((e) =>
        writeToPlayer(e, "sessionData", {
          ...packet,
          yourUUID: e.uuid,
          player: e.player ?? 0,
          spectating: e.spectating,
        })
      )
    }
  }
}

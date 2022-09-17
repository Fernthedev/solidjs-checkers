import { Accessor, batch, createSignal, Setter } from "solid-js"
import { createStore, produce, SetStoreFunction } from "solid-js/store"
import {
  calculatePlayableSpots,
  canBeQueen,
  findKilled,
  getCoordinates,
} from "../../common/board_math"
import {
  CheckerboardPiece,
  CheckerboardPieceIdentity,
  PlayerType,
} from "../../common/models"
import { IMultiplayerCore } from "./multiplayer"

type PieceType = Record<CheckerboardPieceIdentity, CheckerboardPiece>
type PartialPieceType = Partial<PieceType>

export class LocalMultiplayer implements IMultiplayerCore {
  private turn: Accessor<PlayerType>
  private setTurn: Setter<PlayerType>
  private pieces: Readonly<PieceType>
  private setPieces: SetStoreFunction<PartialPieceType>

  constructor(
    private width: number,
    private height: number,
    pieces: CheckerboardPiece[]
  ) {
    const [p, sP] = createStore<PieceType>(
      Object.fromEntries(pieces.map((e) => [e.uuid, e]))
    )
    const [t, setT] = createSignal<PlayerType>(0)

    this.turn = t
    this.setTurn = setT

    this.pieces = p
    this.setPieces = sP as SetStoreFunction<PartialPieceType>
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
    return true
  }

  takeTurn(piece: CheckerboardPiece, square: number): void {
    if (piece.player != this.turn()) throw "Wrong player taking turn!"

    const piecesValues = this.getPieces()

    if (
      !Array.from(
        calculatePlayableSpots(piece, this.width, this.height, piecesValues)
      ).some((e) => e === square)
    )
      throw `Not a valid playable position! ${piece.position} to ${square}`

    const killedPos = findKilled(piece.position, square, this.width)
    const killed = piecesValues.find((e) => e.position === killedPos)

    batch(() => {
      if (killed) {
        if (killed.player === piece.player)
          throw "You can't kill your own piece!"

        this.kill(killed)
      }

      this.moveToSquare(piece, square)
      this.setTurn((t) => (t === 0 ? 1 : 0))
    })

    console.log(`Moved ${piece.position} to ${square}, new turn ${this.turn()}`)
  }

  kill(piece: CheckerboardPiece) {
    this.setPieces(piece.uuid, undefined)
  }

  moveToSquare(piece: CheckerboardPiece, newPosition: number) {
    const queen =
      piece.queen ||
      canBeQueen(piece.player, newPosition, this.width, this.height)

    this.setPieces(piece.uuid, (p) => ({
      ...p,
      queen: queen,
      position: newPosition,
    }))
  }

  playablePositions(piece: CheckerboardPiece): Generator<number> {
    return calculatePlayableSpots(
      piece,
      this.width,
      this.height,
      Object.values(this.pieces)
    )
  }
}

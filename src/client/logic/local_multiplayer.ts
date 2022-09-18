import { Accessor, batch, createSignal, Setter } from "solid-js"
import { createStore, SetStoreFunction } from "solid-js/store"
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
import { IMultiplayerCore } from "./multiplayer"

type PieceType = Record<CheckerboardPieceIdentity, CheckerboardPiece>
type PartialPieceType = Partial<PieceType>

export class LocalMultiplayer implements IMultiplayerCore {
  private turn: Accessor<PlayerType>
  private setTurn: Setter<PlayerType>
  private pieces: Readonly<PieceType>
  private setPieces: SetStoreFunction<PartialPieceType>

  constructor(
    private readonly widthConst: number,
    private readonly heightConst: number,
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

  get canTakeTurn(): Accessor<boolean> {
    return () => true
  }

  get spectating(): Accessor<boolean> {
    return () => false
  }

  get width(): Accessor<number> {
    return () => this.widthConst
  }
  get height(): Accessor<number> {
    return () => this.heightConst
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
        calculatePlayableSpots(
          piece,
          this.widthConst,
          this.heightConst,
          piecesValues
        )
      ).some((e) => e === square)
    )
      throw `Not a valid playable position! ${piece.position} to ${square}`

    const killedPos = findKilled(piece.position, square, this.widthConst)
    const killed = piecesValues.find((e) => e.position === killedPos)

    batch(() => {
      if (killed) {
        if (killed.player === piece.player)
          throw "You can't kill your own piece!"

        this.kill(killed.uuid)
      }

      this.moveToSquare(piece, square)
      this.setTurn((t) => (t === 0 ? 1 : 0))
    })
  }

  kill(piece: CheckerboardPieceIdentity) {
    this.setPieces(piece, undefined)
  }

  moveToSquare(piece: CheckerboardPiece, newPosition: number) {
    const queen =
      piece.queen ||
      canBeQueen(piece.player, newPosition, this.widthConst, this.heightConst)

    this.setPieces(piece.uuid, (p) => ({
      ...p,
      queen: queen,
      position: newPosition,
    }))
  }

  validMovesForPiece(piece: CheckerboardPiece): Generator<number> {
    return calculatePlayableSpots(
      piece,
      this.widthConst,
      this.heightConst,
      Object.values(this.pieces)
    )
  }
}

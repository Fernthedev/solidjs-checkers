import { Accessor } from "solid-js"
import { CheckerboardPiece, CheckerboardPieceIdentity, PlayerType } from "../../common/models"


export interface IMultiplayerCore {
  get width(): Accessor<number>;
  get height(): Accessor<number>;
  get spectating(): Accessor<boolean>

  get whosTurn(): Accessor<PlayerType>

  get canTakeTurn(): Accessor<boolean>

  local(): boolean

  takeTurn(piece: CheckerboardPiece, square: number): void

  playablePositions(piece: CheckerboardPiece): Generator<number>

  pieceAtLocation(square: number): CheckerboardPiece | null

  getPieces(player?: PlayerType): Readonly<CheckerboardPiece[]>
}

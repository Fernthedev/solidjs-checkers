import { CheckerboardPiece, CheckerboardPieceIdentity, PlayerType } from "../../common/models"


export interface IMultiplayerCore {
  whosTurn(): PlayerType

  local(): boolean

  takeTurn(piece: CheckerboardPiece, square: number): void

  playablePositions(piece: CheckerboardPiece): Generator<number>

  pieceAtLocation(square: number): CheckerboardPiece | null

  getPieces(player?: PlayerType): Readonly<CheckerboardPiece[]>
}

import { CheckerboardPiece, CheckerboardPieceIdentity, PlayerType } from "../models"

export interface Packet {
  sessionClosed?: GameSessionClosed,
  serverError?: ServerError,
  pieceQueen?: PieceQueen,
  pieceKilled?: PieceKilled,
  pieceMoved?: PieceMoved,
  changeTurn?: ChangeTurn,
  sessionData?: SessionData | null
}

interface ServerError {
  error: string
}

interface GameSessionClosed {}

interface PieceQueen {
  uuid: CheckerboardPieceIdentity
}

interface PieceKilled {
  uuid: CheckerboardPieceIdentity
}

interface PieceMoved {
  uuid: CheckerboardPieceIdentity
  newPosition: number
}

interface ChangeTurn {
  newTurn: PlayerType
}

interface SessionData {
  width: number,
  height: number,
  pieces: CheckerboardPiece[]
}
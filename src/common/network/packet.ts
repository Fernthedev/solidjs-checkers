import {
  CheckerboardPiece,
  CheckerboardPieceIdentity,
  PlayerType,
} from "../models"

export interface InitialHandshakePacket {
  lobbyID: number
}

export interface Packet {
  sessionClosed?: GameSessionClosed
  serverError?: ServerError
  pieceQueen?: PieceQueen
  pieceKilled?: PieceKilled
  pieceMoved?: PieceMoved
  changeTurn?: ChangeTurn
  sessionData?: SessionData | null
}

interface ServerError {
  error: string
}

interface GameSessionClosed {
  winner: number | null
}

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
  width: number
  height: number
  pieces: CheckerboardPiece[]
  yourUUID: CheckerboardPieceIdentity
  player: PlayerType
  spectating: boolean
}

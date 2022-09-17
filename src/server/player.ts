import {
  CheckerboardPieceIdentity,
  CheckerboardPiece,
  PlayerType,
} from "../common/models"

export interface IPlayer {
  socket: WebSocket
  spectating: boolean
  uuid: number
  player: PlayerType
  pieces: Record<CheckerboardPieceIdentity, CheckerboardPiece>
}

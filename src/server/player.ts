import ws from "ws"
import {
  CheckerboardPieceIdentity,
  CheckerboardPiece,
  PlayerType,
} from "../common/models"

export interface IPlayer {
  socket: ws.WebSocket
  spectating: boolean
  uuid: number
  player: PlayerType | null
  pieces: Record<CheckerboardPieceIdentity, CheckerboardPiece>
}

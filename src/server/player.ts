import ws from "ws"

import { CheckerboardPiece, PlayerType } from "../common/models"

export interface IPlayer {
  socket: ws.WebSocket
  spectating: boolean
  uuid: number
  player: PlayerType
  pieces: CheckerboardPiece[]
}


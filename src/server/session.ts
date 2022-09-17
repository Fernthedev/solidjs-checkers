import { CloseEvent } from "ws";
import { IPlayer } from "./player";


class Session {
  constructor(public readonly players: IPlayer[]) {
    players.forEach((player) => {
      player.socket.addEventListener("close", this.clientDisconnected)
    })
  }

  clientDisconnected(event: CloseEvent) {
      this.players.forEach((e) => {
          if (e.socket.readyState != WebSocket.OPEN) return
        
          
          e.socket.terminate()
    })
  }
}

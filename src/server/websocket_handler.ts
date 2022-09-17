import { IncomingMessage } from "http"
import ws from "ws"
import { LOBBY_HEADER } from "../common/network/network"
import { InitialHandshakePacket } from "../common/network/packet"
import { createPlayer, getSession } from "./game_controller"

export function onWebSocketConnect(ws: ws.WebSocket, req: IncomingMessage) {
  ws.once("message", (ev: ws.Data) => {
    const packet = JSON.parse(ev as string) as InitialHandshakePacket

    const lobbyID = packet.lobbyID

    console.log("Received initial message", lobbyID)

    if (!lobbyID) {
      ws.terminate()
      return
    }

    const session = getSession(lobbyID)

    if (!session) {
      console.log("Session not found, terminating")
      ws.close()
      return
    }

    const player = createPlayer(ws)
    session.addPlayer(player)
    ws.send(
      JSON.stringify({
        uuid: player.uuid,
      })
    )
  })
}

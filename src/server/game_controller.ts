import ws from "ws"
import { getRandomInt } from "../common/board_math"
import { LobbySession } from "./lobby"
import { IPlayer } from "./player"

const sessions: Record<number, LobbySession> = {}

export function createPlayer(ws: ws.WebSocket): IPlayer {
  return {
    socket: ws,
    spectating: false,
    uuid: getRandomInt(),
    player: 0,
    pieces: [],
  }
}

export function createSession(
  width: number,
  height: number
): LobbySession {
  let id = getRandomInt();  // getRandomInt()
  while (Object.hasOwn(sessions, id)) {
    id = getRandomInt()
  }

  console.log("Created session", id)

  return (sessions[id] = new LobbySession(id, width, height))
}

export function getSession(id: number) {
  return sessions[id]
}

export function removeSession(
    id: number
) {
  console.log("Removed session", id)
    sessions[id]?.end()
    delete sessions[id]
}
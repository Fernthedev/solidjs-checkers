import { LobbySession } from "./lobby"
import { IPlayer } from "./player"

const sessions: Record<number, LobbySession> = {}

export function getRandomInt(
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER
) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

function createPlayer(ws: WebSocket): IPlayer {
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
  let id = getRandomInt()
  while (Object.hasOwn(sessions, id)) {
    id = getRandomInt()
  }

  return (sessions[id] = new LobbySession(id, width, height))
}

export function getSession(id: number) {
  return sessions[id]
}

export function removeSession(
    id: number
) {
    sessions[id]?.end()
    delete sessions[id]
}
import ws from "ws"
import { IPlayer } from "../../server/player"
import { Packet } from "./packet"

export const LOBBY_HEADER = "CHECKERS-LOBBY-ID"

export function writeToPlayer<K extends keyof Packet, T extends Packet[K]>(
  player: IPlayer | IPlayer[],
  key: K,
  packet: T
) {
  const packetWrapper: Packet = {
    [key]: packet,
  }

  const json = JSON.stringify(packetWrapper)

  function write(ws: ws.WebSocket) {
    ws.send(json)
  }

  if (player instanceof Array) {
    player.forEach((p) => write(p.socket))
  } else {
    write(player.socket)
  }
}

export function readPacket(json: string) {
  return JSON.parse(json) as Packet
}

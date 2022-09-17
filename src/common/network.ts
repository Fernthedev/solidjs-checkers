import { IPlayer } from "../server/player";

export function writeToPlayer<K extends keyof Packet, T = Packet[K]>(
  player: IPlayer | IPlayer[],
  key: K,
  packet: T
) {}

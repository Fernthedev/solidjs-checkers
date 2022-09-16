import { Player } from "./logic/multiplayer"

export interface CheckerboardPiece {
    position: number
    queen: boolean
    uuid: number
    player: Player
}
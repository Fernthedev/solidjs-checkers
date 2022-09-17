export type PlayerType = 0 | 1

export interface CheckerboardPiece {
  position: number
  queen: boolean
  uuid: number
  player: PlayerType
}

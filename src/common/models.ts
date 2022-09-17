export type PlayerType = 0 | 1

export type CheckerboardPieceIdentity = number

export interface CheckerboardPiece {
  position: number
  queen: boolean
  uuid: CheckerboardPieceIdentity
  player: PlayerType | null
}

import { CheckerboardPiece } from "../models";

export type Player = 0 | 1;

export interface IMultiplayerCore {
  whosTurn(): Player;

  local(): boolean;

  takeTurn(piece: CheckerboardPiece, square: number): void;

  playablePositions(piece: CheckerboardPiece): Generator<number>;

  pieceAtLocation(square: number): CheckerboardPiece | null;

  getPieces(player?: Player): Readonly<Record<number, CheckerboardPiece>>;
}

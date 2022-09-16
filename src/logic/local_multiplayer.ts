import { Accessor, createSignal, Setter } from "solid-js";
import { createStore, produce, SetStoreFunction } from "solid-js/store";
import {
  calculatePlayableSpots,
  canBeQueen,
  findKilled,
  getCoordinates,
} from "../board_math";
import { CheckerboardPiece } from "../models";
import { IMultiplayerCore, Player } from "./multiplayer";

type PieceType = Record<number, CheckerboardPiece>;
type PartialPieceType = Partial<PieceType>;

export class LocalMultiplayer implements IMultiplayerCore {
  private turn: Accessor<Player>;
  private setTurn: Setter<Player>;
  private pieces: Readonly<PieceType>;
  private setPieces: SetStoreFunction<PartialPieceType>;

  constructor(
    private width: number,
    private height: number,
    pieces: CheckerboardPiece[]
  ) {
    const [p, sP] = createStore<PieceType>(
      Object.fromEntries(pieces.map((e) => [e.position, e]))
    );
    const [t, setT] = createSignal<Player>(0);

    this.turn = t;
    this.setTurn = setT;

    this.pieces = p;
    this.setPieces = sP as SetStoreFunction<PartialPieceType>;
  }

  getPieces(
    player?: Player | undefined
  ): Readonly<Record<number, CheckerboardPiece>> {
    if (!player) return this.pieces;

    return Object.fromEntries(
      Object.values(this.pieces)
        .filter((p) => p.player === player)
        .map((e) => [e!.position, e])
    );
  }

  pieceAtLocation(square: number): CheckerboardPiece | null {
    return this.pieces[square] ?? null;
  }

  whosTurn(): Player {
    return this.turn();
  }
  local(): boolean {
    return true;
  }

  takeTurn(piece: CheckerboardPiece, square: number): void {
    if (piece.player != this.turn()) throw "Wrong player taking turn!";

    const piecesValues = Object.values(this.pieces);

    if (
      !Array.from(
        calculatePlayableSpots(piece, this.width, this.height, piecesValues)
      ).some((e) => e === square)
    )
      throw `Not a valid playable position! ${piece.position} to ${square}`;

    const killedPos = findKilled(piece.position, square, this.width);
    const killed = piecesValues.find((e) => e.position === killedPos);

    if (killed) {
      if (killed.player === piece.player)
        throw "You can't kill your own piece!";

      this.kill(killed);
    }

    this.moveToSquare(piece, square);
    this.setTurn((t) => (t === 0 ? 1 : 0));
    console.log(
      `Moved ${piece.position} to ${square}, new turn ${this.turn()}`
    );
  }

  kill(piece: CheckerboardPiece) {
    this.setPieces(piece.position, undefined);
  }

  moveToSquare(piece: CheckerboardPiece, newPosition: number) {
    /// Delete old position
    this.setPieces(
      produce((p) => {
        delete p[piece.position];

        const queen = piece.queen || canBeQueen(piece.player, newPosition, this.width, this.height)

        /// New position
        p[newPosition] = {
          ...piece,
          queen: queen,
          position: newPosition,
        };
      })
    );
  }

  playablePositions(piece: CheckerboardPiece): Generator<number> {
    return calculatePlayableSpots(
      piece,
      this.width,
      this.height,
      Object.values(this.pieces)
    );
  }
}

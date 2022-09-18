import { batch, createMemo, createSignal, For, Show } from "solid-js"

import {
  availableCircleSpots,
  isPlayableSquare,
} from "../../../common/board_math"
import { Colors } from "../../colorscheme"
import { CheckerboardPiece } from "../../../common/models"
import Circle from "./circle"
import Square from "./square"

import "./board.css"
import { IMultiplayerCore } from "../../logic/multiplayer"

interface CheckerBoardProps {
  width: number
  height: number

  multiplayer: IMultiplayerCore
}

export default function CheckerBoard(props: CheckerBoardProps) {
  const multiplayer = () => props.multiplayer
  const [selectedPiece, setSelectedPiece] =
    createSignal<CheckerboardPiece | null>(null)

  /// Combine pieces and squares
  const squareAndPieces = createMemo<readonly (CheckerboardPiece | null)[]>(
    () =>
      Array(props.width * props.height)
        .fill(null)
        .map((_, i) => multiplayer().pieceAtLocation(i))
  )

  const validMoves = createMemo(() => {
    const piece = selectedPiece()
    const result = piece && Array.from(multiplayer().validMovesForPiece(piece))

    return result
  })

  function onSquareClick(squareId: number) {
    const piece = selectedPiece()

    if (!piece) return // no piece selected
    if (piece.position === squareId) return // square where piece was selected should be ignored
    if (!validMoves()!.some((e) => e === squareId)) return // Not a playable location

    batch(() => {
      const newPosition = squareId

      /// Move to new location
      multiplayer().takeTurn(piece, newPosition)
      setSelectedPiece(null)
    })
  }

  return (
    <>
      <div
        class="flex center"
      >
        <div
          class="checker-grid"
          style={{
            "grid-template-columns": `repeat(${props.width}, 1fr)`,
            "grid-template-rows": `repeat(${props.height}, 1fr)`,
          }}
        >
          <For each={squareAndPieces()}>
            {(piece, index) => {
              // Function so it reacts in tracking scope
              const squareClass = createMemo(() => {
                if (validMoves()?.some((e) => e === index()))
                  return "square-highlight"

                return isPlayableSquare(index(), props.width)
                  ? "square-invert"
                  : "square-white"
              })

              return (
                <Square
                  onClick={() => onSquareClick(index())}
                  squareClass={squareClass()}
                >
                  <Show when={piece} keyed>
                    {(piece) => {
                      const circleInteractable = () =>
                        multiplayer().whosTurn() == piece.player &&
                        multiplayer().canTakeTurn() // for network

                      return (
                        <Circle
                          queen={piece.queen}
                          highlighted={selectedPiece() === piece}
                          color={
                            piece.player === 0 ? Colors.player1 : Colors.player2
                          }
                          interactable={circleInteractable()}
                          onClick={() =>
                            circleInteractable() &&
                            setSelectedPiece((p) =>
                              p === piece ? null : piece
                            )
                          }
                          radius={50}
                        />
                      )
                    }}
                  </Show>
                </Square>
              )
            }}
          </For>
        </div>
      </div>
    </>
  )
}

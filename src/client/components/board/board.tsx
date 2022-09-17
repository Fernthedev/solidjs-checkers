import { batch, createMemo, createSignal, For, Show } from "solid-js"

import { availableCircleSpots } from "../../../common/board_math"
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

interface CheckerboardSlot {
  playable: boolean
}

export default function CheckerBoard(props: CheckerBoardProps) {
  const multiplayer = () => props.multiplayer
  const [selectedPiece, setSelectedPiece] =
    createSignal<CheckerboardPiece | null>(null)

  const squares = createMemo<readonly CheckerboardSlot[]>(() => {
    const playables = Array.from(
      availableCircleSpots(props.width, props.height)
    ).map((e) => e[0] + e[1] * props.width)

    const array = Array(props.width * props.height)
      .fill(undefined)
      .map<CheckerboardSlot>((_, squareId) => ({
        playable: playables.some((p) => p === squareId),
      }))

    return array
  })

  /// Combine pieces and squares
  const squareAndPieces = createMemo<
    readonly [CheckerboardSlot, CheckerboardPiece | null][]
  >(() => squares().map((s, i) => [s, multiplayer().pieceAtLocation(i)]))

  const playableSpotsArray = createMemo(() => {
    const piece = selectedPiece()
    const result = piece && Array.from(multiplayer().playablePositions(piece))

    return result
  })

  function onSquareClick(squareId: number) {
    const piece = selectedPiece()

    if (!piece) return // no piece selected
    if (piece.position === squareId) return // square where piece was selected should be ignored
    if (!playableSpotsArray()!.some((e) => e === squareId)) return // Not a playable location

    batch(() => {
      const oldPosition = piece.position
      const newPosition = squareId

      /// Move to new location
      multiplayer().takeTurn(piece, newPosition)
      setSelectedPiece(null)
    })
  }

  function onCircleClick(piece: CheckerboardPiece) {
    if (
      multiplayer().whosTurn() == piece.player &&
      multiplayer().canTakeTurn() // for network
    ) {
      setSelectedPiece((p) => (p === piece ? null : piece))
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        }}
      >
        <div
          class="checker-grid"
          style={{
            "grid-template-columns": `repeat(${props.width}, 1fr)`,
            "grid-template-rows": `repeat(${props.height}, 1fr)`,
          }}
        >
          <For each={squareAndPieces()}>
            {([square, piece], index) => {
              // Function so it reacts in tracking scope
              const squareClass = createMemo(() => {
                if (playableSpotsArray()?.some((e) => e === index()))
                  return "square-highlight"

                return square.playable ? "square-invert" : "square-white"
              })

              return (
                <Square
                  onClick={[onSquareClick, index()]}
                  squareClass={squareClass()}
                >
                  <Show when={piece} keyed>
                    {(piece) => (
                      <Circle
                        queen={piece.queen}
                        highlighted={selectedPiece() === piece}
                        color={
                          piece.player === 0 ? Colors.player1 : Colors.player2
                        }
                        onClick={[onCircleClick, piece]}
                        radius={50}
                      />
                    )}
                  </Show>
                  <span
                    style={{
                      display: "inline-block",
                      position: "absolute",
                      "z-index": 1,
                      margin: 0,
                      border: 0,
                      padding: 0,
                    }}
                  >
                    {index()}
                  </span>
                </Square>
              )
            }}
          </For>
        </div>
      </div>
    </>
  )
}

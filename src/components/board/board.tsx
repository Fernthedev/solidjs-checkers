import { batch, createMemo, createRenderEffect, createSignal, For, Index, JSX, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { availableCircleSpots, calculatePlayableSpots, getPosition } from "../../board_math";
import { Colors } from "../../colorscheme";
import { CheckerboardPiece } from "../../models";
import Circle from "./circle";
import Square from "./square";

interface CheckerBoardProps {
    width: number,
    height: number

    initialPieces: readonly CheckerboardPiece[]
}

interface CheckerboardSlot {
    playable: boolean
}

export default function CheckerBoard(props: CheckerBoardProps) {
    const [checkerPieces, setCheckerPieces] = createStore<Record<number, CheckerboardPiece>>(Object.fromEntries(props.initialPieces.map(e => [e.position, e])))
    const [selectedPiece, setSelectedPiece] = createSignal<CheckerboardPiece | null>(null)


    const squares = createMemo<readonly CheckerboardSlot[]>(() => {
        const playables = Array.from(availableCircleSpots(props.width, props.height)).map(e => e[0] + (e[1] * props.width));

        const array = Array(props.width * props.height).fill(undefined).map<CheckerboardSlot>(
            (_, squareId) => ({
                playable: playables.some(p => p === squareId)
            }));

        return array;
    });

    /// Combine pieces and squares
    const squareAndPieces = createMemo<readonly [CheckerboardSlot, CheckerboardPiece | null][]>(() => squares().map((s, i) => [s, checkerPieces[i]]))

    const playableSpotsArray = createMemo(() => {
        const piece = selectedPiece()
        const result = piece && Array.from(calculatePlayableSpots(piece, props.width, props.height, piece.queen, piece?.player === 0 ? 1 : -1, Object.values(checkerPieces)));

        console.log(result)
        return result
    })

    function moveToSquare(piece: CheckerboardPiece, newPosition: number) {
        batch(() => {
            setCheckerPieces(produce(p => {
                /// Delete old position
                delete p[piece.position]

                /// New position
                p[newPosition] = {
                    ...piece,
                    position: newPosition
                }
            }))
        })
    }

    function onSquareClick(squareId: number) {
        const piece = selectedPiece()

        if (!piece) return; // no piece selected
        if (checkerPieces[squareId]) return; // piece in place, do nothing


        if (!playableSpotsArray()?.some(e => e === squareId)) return

        batch(() => {
            const oldPosition = piece.position;
            const newPosition = squareId;


            console.log("Old location", oldPosition, "new location", newPosition)


            /// Move to new location
            moveToSquare(piece, squareId)
            setSelectedPiece(null)
        })
    }

    return (
        <div style={{
            display: "flex",
            "justify-content": "center",
            "align-items": "center"
        }}>
            <div style={{
                width: "95vmin",
                height: "95vmin",
                display: "grid",
                outline: `${Colors.boardOutline} solid 0.5rem`,
                "grid-template-columns": `repeat(${props.width}, 1fr)`,
                "grid-template-rows": `repeat(${props.height}, 1fr)`
            }}>
                <For each={squareAndPieces()}>
                    {([square, piece], index) => {

                        // Function so it reacts in tracking scope
                        const squareColor = createMemo(() => {
                            if (playableSpotsArray()?.some(e => e === index())) return Colors.highlightedSquare
                            
                            return square.playable ? Colors.invertSquare : Colors.whiteSquare;
                        })
                        
                        return (
                            <Square onClick={(square.playable) ? () => onSquareClick(index()) : undefined}
                                color={squareColor()}>
                                <Show when={piece} keyed>
                                    {(piece) => <Circle
                                        highlighted={selectedPiece() === piece}
                                        color={piece?.player === 0 ? Colors.player1 : Colors.player2}
                                        onClick={() => setSelectedPiece(p => p === piece ? null : piece)}

                                        radius={50} />
                                    }
                                </Show>
                                <span style={{ position: "fixed" }}>
                                    {index()}
                                </span>
                            </Square>
                        );
                    }}
                </For>
            </div>
        </div>
    )

}
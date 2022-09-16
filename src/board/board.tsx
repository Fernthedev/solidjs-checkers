import { batch, createMemo, createRenderEffect, createSignal, For, Index, JSX, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { availableCircleSpots } from "../board_math";
import { CheckerboardPiece } from "../models";
import Circle from "./circle";
import Square from "./square";

interface CheckerBoardProps {
    width: number,
    height: number

    initialPieces: readonly CheckerboardPiece[]
}

interface CheckerboardSlot {
    playablePosition: boolean
}

export default function CheckerBoard(props: CheckerBoardProps) {
    const [checkerPieces, setCheckerPieces] = createStore<Record<number, CheckerboardPiece>>(Object.fromEntries(props.initialPieces.map(e => [e.position, e])))
    const squares = createMemo<readonly CheckerboardSlot[]>(() => {
        const playables = Array.from(availableCircleSpots(props.width, props.height)).map(e => e[0] + (e[1] * props.width));

        const array = Array(props.width * props.height).fill(undefined).map<CheckerboardSlot>(
            (_, squareId) => ({
                playablePosition: playables.some(p => p === squareId)
            }));

        return array;
    });

    const squareAndPieces = createMemo<readonly [CheckerboardSlot, CheckerboardPiece | null][]>(() => squares().map((s, i) => [s, checkerPieces[i]]))

    const [selectedPiece, setSelectedPiece] = createSignal<CheckerboardPiece | null>(null)

    function moveToSquare(piece: CheckerboardPiece, newPosition: number) {
        batch(() => {
            setCheckerPieces(produce(p => {
                delete p[piece.position]
            }))
            setCheckerPieces(newPosition, {
                ...piece,
                position: newPosition
            })
        })
    }




    function onSquareClick(squareId: number) {
        const piece = selectedPiece()

        if (!piece) return; // no piece selected
        if (checkerPieces[squareId]) return; // piece in place, do nothing

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
                outline: "#393939 solid 0.5rem",
                "grid-template-columns": `repeat(${props.width}, 1fr)`,
                "grid-template-rows": `repeat(${props.height}, 1fr)`
            }}>
                <For each={squareAndPieces()}>
                    {([item, piece], index) => {
                        return (
                            <Square onClick={(item.playablePosition) ? () => onSquareClick(index()) : undefined}
                                color={item.playablePosition ? "#555555" : "eeeeee"}>
                                <Show when={piece} keyed>
                                    {(piece) => <Circle
                                        highlighted={selectedPiece() === piece}
                                        color={piece?.player === 0 ? "#819ca9" : "#ffcdd2"}
                                        onClick={() => setSelectedPiece(p => p === piece ? null : piece)}

                                        // color={circleColor ? "#ff0000" : "#00ff00"}
                                        // color={circleColor ? "#eeeeee" : "rgb(255, 255, 255, 0.15)"}
                                        // filter={circleColor ? "blur(4)" : "blur(2)"}
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
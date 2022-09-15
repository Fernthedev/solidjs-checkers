import { Index, JSX } from "solid-js";
import { availableCircleSpots } from "../board_math";
import { CheckerboardPiece } from "../models";
import Circle from "./circle";
import Square from "./square";

interface CheckerBoardProps {
    width: number,
    height: number

    checkerPieces: CheckerboardPiece[]
}

interface CheckerboardSlot {
    piece: CheckerboardPiece | undefined
    playablePosition: boolean
}

export default function CheckerBoard(props: CheckerBoardProps) {
    const squares: CheckerboardSlot[] = Array(props.width * props.height).fill(undefined);

    for (const [column, row] of availableCircleSpots(props.width, props.height)) {
        const squareId = column + (row * props.width);

        // 1 3 5 7 9 are circle squares
        // 1 5 9
        // const hasCircle = !white;
        // const circleColor = squareId % 4 === (row % 2 ? 0 : 1)

        // Find a circle at this coordinate
        const circle = props.checkerPieces.find(e => e.position[0] === column && e.position[1] === row);

        squares[squareId] = {
            piece: circle,
            playablePosition: true
        }
    }


    // Fill the rest of the squares with white
    squares.forEach((square, i) => {
        if (square) return;
        squares[i] = {
            piece: undefined,
            playablePosition: false
        }
    })

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
                <Index each={squares}>
                    {(item, index) => (
                        <Square color={item().playablePosition ? "#555555" : "eeeeee"}>
                            {item().piece &&
                                <Circle
                                color={item().piece?.player === 0 ? "#819ca9" : "#ffcdd2"}

                                    // color={circleColor ? "#ff0000" : "#00ff00"}


                                    // color={circleColor ? "#eeeeee" : "rgb(255, 255, 255, 0.15)"}
                                    // filter={circleColor ? "blur(4)" : "blur(2)"}
                                    radius={50} />}
                            <span style={{ position: "fixed" }}>
                                {index}
                            </span>
                        </Square>
                    )}
                </Index>
            </div>
        </div>
    )

}
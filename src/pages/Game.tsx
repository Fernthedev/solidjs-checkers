import CheckerBoard from "../board/board";
import { availableCircleSpots } from "../board_math";
import { CheckerboardPiece } from "../models";



function* player1Pieces(width: number, height: number): Generator<CheckerboardPiece> {
    // const adjustedWidth = width % 2 === 0 ? width : width + 1;
    // for (let i = 0; i < adjustedWidth; i++) {
    //     yield {
    //         // position: [(((i + 1) * 2) - 1) % 9, Math.floor((i * 2) / 8)],
    //         position: [(((i + 1) * 2) - 1) % (height + 1), Math.floor((((i + 1) * 2) - 1) / (adjustedWidth))],
    //         queen: false,
    //         uuid: 0,
    //         player: 0
    //     };
    // }
    // const adjustedWidth = width % 2 === 0 ? width : width + 1;
    // for (let i = 0; i < adjustedWidth; i++) {
    //     const column = (i * 2) % (height + 1) // i * 2 % (height + 1)
    //     const row = Math.floor((i * 2) / (adjustedWidth))

    //     const offset = row % 2 === column % 2 ? 1 : 0

    //     yield {
    //         // position: [(((i + 1) * 2) - 1) % 9, Math.floor((i * 2) / 8)],
    //         position: [column + offset, row],
    //         queen: false,
    //         uuid: 0,
    //         player: 0
    //     };
    // }
    const spots = availableCircleSpots(width, height);
    for (let i = 0; i < width; i++) {
        
        const [column, row] = spots.next().value!

        yield {
            position: [column, row],
            queen: false,
            uuid: 0,
            player: 0
        };
    }
}

function* player2Pieces(width: number, height: number): Generator<CheckerboardPiece> {
    // const adjustedWidth = width % 2 !== 0 ? width : width + 1;
    // for (let i = 0; i < adjustedWidth; i++) {
    //     yield {
    //         // position: [(((i + 1) * 2) - 1) % 9, Math.floor((i * 2) / 8)],
    //         position: [(((i + 1) * 2)) % (height + 1), height - 1 - Math.floor((((i + 1) * 2) - 1) / (adjustedWidth))],
    //         queen: false,
    //         uuid: 0,
    //         player: 1
    //     };
    // }

    const spots = Array.from(availableCircleSpots(width, height)).reverse().values();
    for (let i = 0; i < width; i++) {
        const [column, row] = spots.next().value!

        yield {
            position: [column, row],
            queen: false,
            uuid: 0,
            player: 1
        };
    }
}

export default function Game() {
    const width = 8;
    const height = 8;

    return (
        <CheckerBoard width={width} height={height} initialPieces={[...player1Pieces(width, height), ...player2Pieces(width, height)]} />
    )
}

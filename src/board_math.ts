import { runWithOwner } from "solid-js"
import { CheckerboardPiece } from "./models"

export function* availableCircleSpots(width: number, height: number) {
    // I am too lazy to find a proper algorithm/formula for this
    for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {

            const white = row % 2 === column % 2
            if (!white) {
                yield [column, row]
            }
        }
    }
}

export function getPosition([column, row]: [number, number], width: number) {
    return column + (row * width)
}

export function* calculatePlayableSpots(square: number, width: number, height: number, queen: boolean, direction: number, pieces: CheckerboardPiece[]) {
    const currentColumn = square % width
    const currentRow = Math.floor(square / width)



    function* yieldClamp(column: number, row: number) {
        if (column < 0) return;
        if (column >= width) return;

        if (row < 0) return;
        if (row >= height) return;


        if (!queen) {
            if (direction < 0 && row >= currentRow) return
            if (direction > 0 && row <= currentRow) return
        }

        if (Math.abs(column - currentColumn) > 2 || Math.abs(row - currentRow) > 2) return
        
        const position = getPosition([column, row], width)
        const conflictingPiece = pieces.find(p => p.position === position)
        if (conflictingPiece) return

        yield column + (row * width);
    }

    function* tryKill(column: number, row: number) {
        const position = getPosition([column, row], width) 
        const conflictingPiece = pieces.find(p => p.position === position)
        if (conflictingPiece) {
            // left
            console.log(conflictingPiece.position, square)
            if (conflictingPiece.position < square) {
                yield* yieldClamp(column - 1, row - 1)
                yield* yieldClamp(column - 1, row + 1)
            } else {
                // right
                yield* yieldClamp(column + 1, row - 1)
                yield* yieldClamp(column + 1, row + 1)
            }
        } else {
            yield* yieldClamp(column, row)
        }
    }


    yield* tryKill(currentColumn - 1, currentRow - 1)
    yield* tryKill(currentColumn + 1, currentRow - 1)
    yield* tryKill(currentColumn - 1, currentRow + 1)
    yield* tryKill(currentColumn + 1, currentRow + 1)
}
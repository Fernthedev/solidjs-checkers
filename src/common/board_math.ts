import { runWithOwner } from "solid-js"
import { getRandomInt } from "../server/game_controller"
import { CheckerboardPiece, PlayerType } from "./models"


export function* playerPieces(
  width: number,
  height: number,
  type: PlayerType,
  reverse: boolean
): Generator<CheckerboardPiece> {
  let spots: IterableIterator<[number, number]> = availableCircleSpots(width, height)

  if (reverse) spots = [...spots].reverse().values()

  for (let i = 0; i < width; i++) {
    const [column, row] = spots.next().value!

    const id = getRandomInt()

    yield {
      position: column + row * width,
      queen: false,
      uuid: id,
      player: type,
    }
  }
}

export function* availableCircleSpots(width: number, height: number): Generator<[number, number], void> {
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

export function getPosition([column, row]: readonly [number, number], width: number) {
  return column + row * width
}

export function getCoordinates(square: number, width: number) {
  return [square % width, Math.floor(square / width)]
}

export function getDirection(player: PlayerType) {
  return player === 0 ? 1 : -1
}

export function findKilled(
  oldPosition: number,
  newPosition: number,
  width: number
) {
  const [column, row] = getCoordinates(oldPosition, width)
  const [newColumn, newRow] = getCoordinates(newPosition, width)

  // modulus to get column
  const x_direction = column < newColumn ? 1 : -1
  const y_direction = row < newRow ? 1 : -1
  const killedPosition = getPosition(
    [column + x_direction, row + y_direction],
    width
  )

  return killedPosition
}

export function canBeQueen(
  player: PlayerType,
  position: number,
  width: number,
  height: number
) {
  const direction = getDirection(player)

  const [_, row] = getCoordinates(position, width)

  if (direction == -1) {
    return row === 0
  } else {
    return row === height - 1
  }
}

export function isPlayableSquare(square: number, width: number) {
  const [column, row] = getCoordinates(square, width)

  return column % 2 !== row % 2
}

export function* calculatePlayableSpots(
  piece: CheckerboardPiece,
  width: number,
  height: number,
  pieces: readonly CheckerboardPiece[]
) {
  const square = piece.position
  const queen = piece.queen
  const direction = getDirection(piece.player)

  const currentColumn = square % width
  const currentRow = Math.floor(square / width)

  function* yieldClamp(column: number, row: number) {
    if (column < 0) return
    if (column >= width) return

    if (row < 0) return
    if (row >= height) return

    if (currentColumn === column || currentRow === row) return

    if (!queen) {
      if (direction < 0 && row > currentRow) return
      if (direction > 0 && row < currentRow) return
    }

    if (Math.abs(column - currentColumn) > 2 || Math.abs(row - currentRow) > 2)
      return

    const position = getPosition([column, row], width)
    const conflictingPiece = pieces.find((p) => p.position === position)
    if (conflictingPiece) return

    yield column + row * width
  }

  function* tryKill(column: number, row: number) {
    const position = getPosition([column, row], width)
    // Check if it's a piece from the other player
    const conflictingPiece = pieces.find(
      (p) => p.player !== piece.player && p.position === position
    )
    if (conflictingPiece) {
      // left
      // modulus to get column
      // console.log(conflictingPiece.position % width, square % width)
      if (conflictingPiece.position % width < square % width) {
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

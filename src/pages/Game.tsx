import CheckerBoard from "../components/board/board"
import { availableCircleSpots } from "../board_math"
import { CheckerboardPiece } from "../models"
import { LocalMultiplayer } from "../logic/local_multiplayer"
import PlayerText from "../components/board/player"
import { createStore } from "solid-js/store"
import { createEffect } from "solid-js"
import { useNavigate } from "@solidjs/router"

function* player1Pieces(
  width: number,
  height: number
): Generator<CheckerboardPiece> {
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
  const spots = availableCircleSpots(width, height)
  for (let i = 0; i < width; i++) {
    const [column, row] = spots.next().value!

    yield {
      position: column + row * width,
      queen: false,
      uuid: 0,
      player: 0,
    }
  }
}

function* player2Pieces(
  width: number,
  height: number
): Generator<CheckerboardPiece> {
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

  const spots = Array.from(availableCircleSpots(width, height))
    .reverse()
    .values()
  for (let i = 0; i < width; i++) {
    const [column, row] = spots.next().value!

    yield {
      position: column + row * width,
      queen: false,
      uuid: 0,
      player: 1,
    }
  }
}

export default function Game() {
  const width = 8
  const height = 8

  const navigator = useNavigate()

  const [multiplayer, setMultiplayer] = createStore(
    new LocalMultiplayer(width, height, [
      ...player1Pieces(width, height),
      ...player2Pieces(width, height),
    ])
  )

  createEffect(() => {
    const pieces = Object.values(multiplayer.getPieces())
    const player1 = pieces.filter((e) => e.player === 0)
    const player2 = pieces.filter((e) => e.player === 1)
    if (player1.length !== 0 && player2.length !== 0) return

    navigator(`/game_over/${player1.length === 0 ? 1 : 0}`)
  })

  return (
    <>
      <PlayerText multiplayer={multiplayer} />
      <CheckerBoard width={width} height={height} multiplayer={multiplayer} />
    </>
  )
}

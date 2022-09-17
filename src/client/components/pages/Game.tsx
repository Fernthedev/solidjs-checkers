import CheckerBoard from "../board/board"
import { availableCircleSpots } from "../../../common/board_math"
import { CheckerboardPiece } from "../../../common/models"
import { LocalMultiplayer } from "../../logic/local_multiplayer"
import PlayerText from "../board/player"
import { createStore } from "solid-js/store"
import { createEffect } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { IMultiplayerCore } from "../../logic/multiplayer"

function* player1Pieces(
  width: number,
  height: number
): Generator<CheckerboardPiece> {
  const spots = availableCircleSpots(width, height)

  for (let i = 0; i < width; i++) {
    const [column, row] = spots.next().value!

    const id = Math.random()

    yield {
      position: column + row * width,
      queen: false,
      uuid: id,
      player: 0,
    }
  }
}

function* player2Pieces(
  width: number,
  height: number
): Generator<CheckerboardPiece> {
  const spots = Array.from(availableCircleSpots(width, height))
    .reverse()
    .values()

  for (let i = 0; i < width; i++) {
    const [column, row] = spots.next().value!

    const id = Math.random()

    yield {
      position: column + row * width,
      queen: false,
      uuid: id,
      player: 1,
    }
  }
}

export default function Game() {
  const width = 8
  const height = 8

  const navigator = useNavigate()

  const [multiplayer, setMultiplayer] = createStore<Readonly<IMultiplayerCore>>(
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

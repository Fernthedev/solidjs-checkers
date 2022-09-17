import CheckerBoard from "../components/board/board"
import { LocalMultiplayer } from "../logic/local_multiplayer"
import PlayerText from "../components/board/player"
import { createStore } from "solid-js/store"
import { createEffect } from "solid-js"
import { Link, useNavigate } from "@solidjs/router"
import { IMultiplayerCore } from "../logic/multiplayer"
import { NetworkMultiplayer } from "../logic/network_multiplayer"
import { playerPieces } from "../../common/board_math"


export default function Game() {
  const width = 8
  const height = 8

  const navigator = useNavigate()

  const [multiplayer, setMultiplayer] = createStore<Readonly<IMultiplayerCore>>(
    new LocalMultiplayer(width, height, [
      ...playerPieces(width, height, 0, false),
      ...playerPieces(width, height, 1, true),
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
      <Link href={"/multiplayer_setup"} style={{ "text-align": "center" }}>
        <h4>Online Multiplayer</h4>
      </Link>
      <CheckerBoard width={width} height={height} multiplayer={multiplayer} />
    </>
  )
}

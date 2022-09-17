import CheckerBoard from "../board/board"
import { LocalMultiplayer } from "../../logic/local_multiplayer"
import PlayerText from "../board/player"
import { createStore } from "solid-js/store"
import { createEffect } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { IMultiplayerCore } from "../../logic/multiplayer"
import { NetworkMultiplayer } from "../../logic/network_multiplayer"


export default function Game() {
  const width = 8
  const height = 8

  const navigator = useNavigate()

  // const [multiplayer, setMultiplayer] = createStore<Readonly<IMultiplayerCore>>(
  //   new LocalMultiplayer(width, height, [
  //     ...player1Pieces(width, height),
  //     ...player2Pieces(width, height),
  //   ])
  // )

  // createEffect(() => {
  //   const pieces = Object.values(multiplayer.getPieces())
  //   const player1 = pieces.filter((e) => e.player === 0)
  //   const player2 = pieces.filter((e) => e.player === 1)
  //   if (player1.length !== 0 && player2.length !== 0) return

  //   navigator(`/game_over/${player1.length === 0 ? 1 : 0}`)
  // })

  const [multiplayer, setMultiplayer] = createStore<Readonly<IMultiplayerCore>>(
    new NetworkMultiplayer(20)
  )

  // createEffect(() => {
  //   const pieces = Object.values(multiplayer.getPieces())
  //   const player1 = pieces.filter((e) => e.player === 0)
  //   const player2 = pieces.filter((e) => e.player === 1)
  //   if (player1.length !== 0 && player2.length !== 0) return

  //   navigator(`/game_over/${player1.length === 0 ? 1 : 0}`)
  // })


  return (
    <>
      <PlayerText multiplayer={multiplayer} />
      <CheckerBoard width={width} height={height} multiplayer={multiplayer} />
    </>
  )
}

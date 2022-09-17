import { Link, Params, useParams } from "@solidjs/router"
import { Show } from "solid-js"
import { createStore } from "solid-js/store"
import { IMultiplayerCore } from "../logic/multiplayer"
import { NetworkMultiplayer } from "../logic/network_multiplayer"
import CheckerBoard from "../components/board/board"
import PlayerText from "../components/board/player"

import "../common.css"

export interface MultiplayerGamePageParams extends Params {
  lobbyID: string
}

export default function MultiplayerGamePage() {
  const params = useParams<MultiplayerGamePageParams>()

  const [multiplayer, setMultiplayer] = createStore(
    new NetworkMultiplayer(parseInt(params.lobbyID))
  )

  return (
    <>
      <h2>Lobby ID: {params.lobbyID}</h2>
      <Show
        when={multiplayer.setup()}
        fallback={<h1>Waiting for game to start...</h1>}
      >
        <PlayerText multiplayer={multiplayer} />
        <Show when={multiplayer.canTakeTurn() || true}>
          <h3 class="center">It is now your turn!</h3>
        </Show>
        <CheckerBoard
          width={multiplayer.width()}
          height={multiplayer.height()}
          multiplayer={multiplayer}
        />
      </Show>
    </>
  )
}

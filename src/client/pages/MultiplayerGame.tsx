import { Link, Params, useNavigate, useParams } from "@solidjs/router"
import { Show } from "solid-js"
import { createStore } from "solid-js/store"
import { IMultiplayerCore } from "../logic/multiplayer"
import { NetworkMultiplayer } from "../logic/network_multiplayer"
import CheckerBoard from "../components/board/board"
import PlayerText from "../components/board/player"

import "../common.css"
import LoadingSpinner from "../components/loading"

export interface MultiplayerGamePageParams extends Params {
  lobbyID: string
}

function LobbyWaiting() {
  return (
    <div class="prose mx-auto text-center items-center flex flex-col">
      <h2>Waiting for game to start...</h2>
      <LoadingSpinner />
    </div>
  )
}

export default function MultiplayerGamePage() {
  const params = useParams<MultiplayerGamePageParams>()

  const navigator = useNavigate()

  const multiplayer = new NetworkMultiplayer(parseInt(params.lobbyID), () =>
    navigator("/game_over/")
  )

  return (
    <>
      <div class="prose text-center mx-auto">
        <h4>Lobby ID: {params.lobbyID}</h4>
      </div>
      <Show when={multiplayer.setup()} fallback={LobbyWaiting()}>
        <PlayerText multiplayer={multiplayer} />
        <Show when={multiplayer.canTakeTurn()}>
          <h3 class="text-center mx-auto">It is now your turn!</h3>
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

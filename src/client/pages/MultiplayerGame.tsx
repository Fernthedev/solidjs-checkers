import { Link, Params, useNavigate, useParams } from "@solidjs/router"
import { createResource, Show } from "solid-js"
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
      <a
        class="link"
        onClick={() => navigator.clipboard.writeText(window.location.href)}
      >
        <h3>Click here to copy link to join!</h3>
      </a>
      <LoadingSpinner />
    </div>
  )
}

export default function MultiplayerGamePage() {
  const params = useParams<MultiplayerGamePageParams>()

  const navigator = useNavigate()

  const multiplayer = new NetworkMultiplayer(
    parseInt(params.lobbyID),
    (winner) => navigator(`/game_over/${winner}`)
  )

  const [data] = createResource(params.lobbyID, (lobbyID) =>
    fetch(`/api/session/find?lobbyID=${lobbyID}`)
  )

  return (
    <>
      <div class="prose text-center mx-auto">
        <h4>Lobby ID: {params.lobbyID}</h4>
      </div>

      <Show when={data.error}>
        <h3 class="text-center mx-auto" color="red">
          Could not find lobby {params.lobbyID}
        </h3>
      </Show>

      <Show when={multiplayer.isSetup()} fallback={LobbyWaiting()}>
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

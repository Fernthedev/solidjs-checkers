import { Link, Params, useParams } from "@solidjs/router"
import { Show } from "solid-js"
import { createStore } from "solid-js/store"
import { IMultiplayerCore } from "../../logic/multiplayer"
import { NetworkMultiplayer } from "../../logic/network_multiplayer"
import CheckerBoard from "../board/board"
import PlayerText from "../board/player"

export interface MultiplayerGamePageParams extends Params {
  lobbyID: string
}

export default function MultiplayerGamePage() {
  const params = useParams<MultiplayerGamePageParams>()

  const [multiplayer, setMultiplayer] = createStore(new NetworkMultiplayer(20))

  return (
    <>
      <h2>Lobby ID: {params.lobbyID}</h2>
      <Show when={multiplayer.setup()}>
        <PlayerText multiplayer={multiplayer} />
        <CheckerBoard width={multiplayer.width()} height={multiplayer.height()} multiplayer={multiplayer} />
      </Show>
    </>
  )
}

import { Params, useParams } from "@solidjs/router"
import { createStore } from "solid-js/store"
import { IMultiplayerCore } from "../../logic/multiplayer"
import { NetworkMultiplayer } from "../../logic/network_multiplayer"

export interface MultiplayerGamePageParams extends Params {
  lobbyID: string
}

export default function MultiplayerGamePage() {
  const params = useParams<MultiplayerGamePageParams>()

  const [multiplayer, setMultiplayer] = createStore<Readonly<IMultiplayerCore>>(
    new NetworkMultiplayer(20)
  )

  return (
    <>
      <h2>Lobby ID: {params.lobbyID}</h2>
    </>
  )
}

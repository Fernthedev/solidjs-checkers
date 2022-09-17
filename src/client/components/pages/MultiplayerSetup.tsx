import { createForm, FelteSubmitError } from "@felte/solid"
import { useNavigate } from "@solidjs/router"
import { createResource, createSignal, Show } from "solid-js"
import {
  LobbyCreationResponse,
  LobbyFindQuery,
} from "../../../common/network/rest"

export default function MultiplayerSetupPage() {
  const navigator = useNavigate()
  // fetch("api/session/start", {
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     width: 8,
  //     height: 8,
  //   }),
  //   method: "POST",
  // })

  async function doHost() {
    const response = await fetch("api/session/start", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        width: 8,
        height: 8,
      }),
      method: "POST",
    })

    const responseData = (await response.json()) as LobbyCreationResponse

    navigator(`/multiplayer/${responseData.lobbyID}`)
  }

  const { form, errors, data } = createForm<LobbyFindQuery>({
    onSuccess: async (response: any, context) => {
      navigator(`/multiplayer/${data().lobbyID}`)
    },
    onError: (e) => (e as any).response.status === 404 ? { "error": "lobby not found" } : e as any,
  })
  // const [data, { mutate, refetch }] = createResource((e) => {

  // })

  return (
    <div>
      <button onClick={doHost}>Host</button>
      <form use:form action="/api/session/find" method="get">
        <input type="number" name="lobbyID" id={"lobbyID"} />
        <button type="submit">Join</button>

        <br />

        <Show when={data()} keyed>
          {(data) => <span>{JSON.stringify(data)}</span>}
        </Show>

        <Show when={errors() as FelteSubmitError | {error: string | undefined} | undefined} keyed>
          {(messages) => (
            <pre>
              <Show
                when={(messages as any)?.error}
                fallback={JSON.stringify(messages)}
              >
                Lobby not found
              </Show>
            </pre>
          )}
        </Show>
      </form>
    </div>
  )
}

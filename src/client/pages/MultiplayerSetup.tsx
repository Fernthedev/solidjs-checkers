import { createForm, FelteSubmitError } from "@felte/solid"
import { useNavigate } from "@solidjs/router"
import { createResource, createSignal, Show } from "solid-js"
import {
  LobbyCreationResponse,
  LobbyFindQuery,
} from "../../common/network/rest"
import LoadingSpinner from "../components/loading"

export default function MultiplayerSetupPage() {
  const navigator = useNavigate()

  const [hosting, setHosting] = createSignal(false)

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

  const [width, setWidth] = createSignal(8)
  const [height, setHeight] = createSignal(8)

  async function doHost() {
    setHosting(true)

    const response = await fetch("api/session/start", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        width: Math.abs(width()) ?? 8, // make 0 -> 8 because null
        height: Math.abs(height()) ?? 8,
      }),
      method: "POST",
    })

    const responseData = (await response.json()) as LobbyCreationResponse

    navigator(`/multiplayer/${responseData.lobbyID}`)
  }

  const { form, errors, data, isSubmitting } = createForm<LobbyFindQuery>({
    onSuccess: async (response: any, context) => {
      navigator(`/multiplayer/${data().lobbyID}`)
    },
    onError: (e) =>
      (e as any).response.status === 404
        ? { error: "lobby not found" }
        : (e as any),
  })
  // const [data, { mutate, refetch }] = createResource((e) => {

  // })

  return (
    <div class="place-content-center gap-4 flex items-center flex-col">
      <button class="btn btn-accent m-5 mt-10" onClick={doHost}>
        Host
      </button>

      <div></div>
      <input
        placeholder="Width"
        class="input input-bordered input-accent"
        name="width"
        id={"width"}
        value={width()}
        onInput={(e) => setWidth(parseInt(e.currentTarget.value))}
      />
      <input
        placeholder="height"
        class="input input-bordered input-accent"
        name="height"
        id={"height"}
        value={height()}
        onInput={(e) => setHeight(parseInt(e.currentTarget.value))}
      />

      <br />

      <form use:form action="/api/session/find" method="get">
        <input
          placeholder="Session code"
          class="input input-bordered input-primary"
          name="lobbyID"
          id={"lobbyID"}
        />

        <button class="btn m-5" type="submit">
          Join
        </button>

        <br />

        <Show
          when={
            errors() as
              | FelteSubmitError
              | { error: string | undefined }
              | undefined
          }
          keyed
        >
          {(messages) => (
            <pre>
              <Show when={(messages as any)?.error}>Lobby not found</Show>
            </pre>
          )}
        </Show>

        <Show when={isSubmitting() || hosting()}>
          <div class="mx-auto flex items-center flex-col h-20 w-20">
            <LoadingSpinner />
          </div>
        </Show>
      </form>
    </div>
  )
}

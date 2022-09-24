import { Params, useParams } from "@solidjs/router"

interface GameOverParams extends Params {
  player: string
}

export default function GameOverPage() {
  const params = useParams<GameOverParams>()

  return (
    <div class="prose text-center mx-auto">
      <h2 class="text-3xl p-10">
        The winner is Player {parseInt(params.player) + 1}
      </h2>
    </div>
  )
}

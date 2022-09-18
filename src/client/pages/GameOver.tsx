import { Params, useParams } from "@solidjs/router"

interface GameOverParams extends Params {
  player: string
}

export default function GameOverPage() {
  const params = useParams<GameOverParams>()

  return (
    <div class="center prose">
      <h2 class="text-3xl">The winner is Player {parseInt(params.player) + 1}</h2>
    </div>
  )
}

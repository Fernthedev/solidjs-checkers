import { Params, useParams } from "@solidjs/router";

interface GameOverParams extends Params {
    player: string
}

export default function GameOverPage() {
    const params = useParams<GameOverParams>()

    return (
        <h1>
            The winner is Player {parseInt(params.player) + 1}
        </h1>
    )
}
import { CheckerboardPieceIdentity } from "../common/models"
import { removeSession } from "./game_controller"
import { IPlayer } from "./player"
import { GameSession } from "./game_server"

export class LobbySession {
  session: GameSession | null = null
  players: Record<CheckerboardPieceIdentity, IPlayer> = {}

  constructor(
    public readonly id: number,
    public readonly width: number,
    public readonly height: number
  ) {}

  addPlayer(player: IPlayer) {
    if (this.session) {
      this.session.addSpectator(player)
      return
    }
    this.players[player.uuid] = player

    player.socket.addEventListener("close", () => {
      delete this.players[player.uuid]
      this.destroyIfEmpty()
    })

    if (Object.entries(this.players).length >= 2) {
      player.player = 1
      this.start()
    }
  }

  destroyIfEmpty() {
    if (Object.entries(this.players).length === 0) {
      removeSession(this.id)
    }
  }

  start() {
    this.session ??= new GameSession(
      this.id,
      this.width,
      this.height,
      Object.values(this.players)
    )

    setTimeout(this.destroyIfEmpty, 1000 * 60)
  }

  end() {
    this.session = null
    this.players = []
  }
}

import { Route, Router, Routes } from "@solidjs/router"
import { render } from "solid-js/web"
import Game from "./pages/Game"
import GameOverPage from "./pages/GameOver"
import MultiplayerGamePage from "./pages/MultiplayerGame"
import MultiplayerSetupPage from "./pages/MultiplayerSetup"

render(
  () => (
    <Router>
      <Routes>
        <Route path={"/"} component={Game} />
        <Route path={"/multiplayer_setup"} component={MultiplayerSetupPage} />
        <Route path={"/multiplayer/:lobbyID"} component={MultiplayerGamePage} />
        <Route path={"/game_over/:player"} component={GameOverPage} />
      </Routes>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
)

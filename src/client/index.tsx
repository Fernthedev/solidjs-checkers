import { Route, Router, Routes } from "@solidjs/router"
import { render, Suspense } from "solid-js/web"
import Game from "./pages/Game"
import GameOverPage from "./pages/GameOver"
import MultiplayerGamePage from "./pages/MultiplayerGame"
import MultiplayerSetupPage from "./pages/MultiplayerSetup"

import "./index.css"
import LoadingSpinner from "./components/loading"

render(
  () => (
    <Router>
      <Suspense
        fallback={
          <div class="center">
            <LoadingSpinner />
          </div>
        }
      >
        <Routes>
          <Route path={"/"} component={Game} />
          <Route path={"/multiplayer_setup"} component={MultiplayerSetupPage} />
          <Route
            path={"/multiplayer/:lobbyID"}
            component={MultiplayerGamePage}
          />
          <Route path={"/game_over/:player"} component={GameOverPage} />
        </Routes>
      </Suspense>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
)

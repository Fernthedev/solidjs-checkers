import { Route, Router, Routes } from "@solidjs/router"
import { render } from "solid-js/web"
import Game from "./components/pages/Game"
import GameOverPage from "./components/pages/GameOver"

render(
  () => (
    <Router>
      <Routes>
        <Route path={"/"} component={Game} />
        <Route path={"/game_over/:player"} component={GameOverPage} />
      </Routes>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
)

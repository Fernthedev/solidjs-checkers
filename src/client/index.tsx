import { Route, Router, Routes } from "@solidjs/router"
import { render, Suspense } from "solid-js/web"
import Game from "./pages/Game"
import GameOverPage from "./pages/GameOver"
import MultiplayerGamePage from "./pages/MultiplayerGame"
import MultiplayerSetupPage from "./pages/MultiplayerSetup"
import { HopeProvider, HopeThemeConfig } from "@hope-ui/solid"

import "./index.css"
import { Center, NotificationsProvider, Spinner } from "@hope-ui/solid"

// 1. Create a theme config
const config: HopeThemeConfig = {
  initialColorMode: "system", // 2. Add your color mode
  // rest of the config...
}

render(
  () => (
    <Router>
      {/* <HopeProvider config={config} enableCssReset={false}> */}
        {/* <NotificationsProvider> */}
          <Suspense
            fallback={
              <Center mt="$4">
                <Spinner size="lg" thickness="3px" color="$primary9" />
              </Center>
            }
          >
            <Routes>
              <Route path={"/"} component={Game} />
              <Route
                path={"/multiplayer_setup"}
                component={MultiplayerSetupPage}
              />
              <Route
                path={"/multiplayer/:lobbyID"}
                component={MultiplayerGamePage}
              />
              <Route path={"/game_over/:player"} component={GameOverPage} />
            </Routes>
          </Suspense>
        {/* </NotificationsProvider> */}
      {/* </HopeProvider> */}
    </Router>
  ),
  document.getElementById("root") as HTMLElement
)

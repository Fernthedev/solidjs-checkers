import express from "express"
import {
  LobbyCreationRequest,
  LobbyCreationResponse,
} from "../../common/network/rest"
import { createSession } from "../game_controller"

const sessionRouter = express.Router()

sessionRouter.post<{}, LobbyCreationResponse, LobbyCreationRequest>(
  "/start",
  (req, res) => {
    const { width, height } = req.body

    const lobby = createSession(width, height)

    res.json({
      lobbyID: lobby.id,
    })
  }
)

export default sessionRouter

import express from "express"
import {
  LobbyCreationRequest,
  LobbyCreationResponse,
} from "../../common/network/rest"
import { createSession } from "../game_controller"

const sessionRouter = express.Router()

sessionRouter.post<{}, LobbyCreationResponse | string, LobbyCreationRequest>(
  "/start",
  (req, res) => {
    const { width, height } = req.body

    if (!width || !height) {
      res.status(400).send("Provide width and height!")
      return
    }

    const lobby = createSession(width, height)
    res.json({
      lobbyID: lobby.id,
    })
  }
)

export default sessionRouter

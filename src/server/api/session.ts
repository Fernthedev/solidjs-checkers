import express from "express"
import {
  LobbyCreationRequest,
  LobbyCreationResponse,
  LobbyFindQuery,
} from "../../common/network/rest"
import { createSession, getSession } from "../game_controller"

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

sessionRouter.get<{}, {}, {}, LobbyFindQuery>("/find", (req, res) => {
  const { lobbyID } = req.query

  if (!lobbyID) {
    res.status(400).send("Provide lobby ID!")
    return
  }

  const lobby = getSession(lobbyID)

  if (lobby) {
    res.status(200).send()
  } else {
    res.status(404).send()
  }
})

export default sessionRouter

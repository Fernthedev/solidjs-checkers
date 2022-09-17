import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import express from "express"
import router from "./src/server/api/routes"
import ws from "ws"

const { PORT = 5173 } = process.env

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export let wsServer: ws.Server

async function createServer() {
  const app = express()


  wsServer = new ws.Server({ noServer: true })

  // Middleware that parses json and looks at requests where the Content-Type header matches the type option.
  app.use(express.json())

  // Serve API requests from the router
  app.use("/api", router)

  // Serve app production bundle
  app.use(express.static("dist/app"))

  app.get("*", async (_req, res) => {
    res.sendFile(path.join(__dirname, "app/index.html"))
  })

  console.log(`Listening to ${PORT}`)

  const server = app.listen(PORT)

  server.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (socket) => {
      wsServer.emit("connection", socket, request)
    })
  })
}

createServer()


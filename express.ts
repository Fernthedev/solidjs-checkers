import path from "path"
import { fileURLToPath } from "url"
import express from "express"
import router from "./src/server/api/routes"
import ws, { WebSocketServer } from "ws"
import { onWebSocketConnect } from "./src/server/websocket_handler"

const { PORT = 5173 } = process.env

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export let wsServer: ws.Server

function setSocketAlive(ws: ws.WebSocket, alive: boolean) {
  ;(ws as any).isAlive = alive
}
function getSocketAlive(ws: ws.WebSocket) {
  return (ws as any).isAlive as boolean
}

async function createServer() {
  const app = express()

  wsServer = new WebSocketServer({ noServer: true })

  wsServer.on("connection", (ws) => {
    setSocketAlive(ws, true)
    ws.on("pong", () => {
      setSocketAlive(ws, true)
    })
    ws.on("message", () => {
      setSocketAlive(ws, true)
    })
  })

  const interval = setInterval(() => {
    wsServer.clients.forEach((ws) => {
      if (getSocketAlive(ws) === false) return ws.terminate()

      setSocketAlive(ws, false)
      ws.ping()
      ws.send("{}") // trigger message for client
    })
  }, 30000)

  wsServer.on("close", () => {
    clearInterval(interval)
  })

  // Middleware that parses json and looks at requests where the Content-Type header matches the type option.
  app.use(express.json())

  // Serve API requests from the router
  app.use("/api", router)

  // Serve app production bundle
  console.log("loading at", path.join(__dirname, "app"))

  app.use("/assets", express.static(path.join(__dirname, "app", "assets"), {}))

  // Fallback to index
  app.use("*", async (_req, res) => {
    res.sendFile(path.join(__dirname, "app", "index.html"))
  })

  console.log(`Listening to ${PORT}`)

  const server = app.listen(PORT)

  server.on("upgrade", (request, socket, head) => {
    console.log("Upgrading connection")
    wsServer.handleUpgrade(request, socket, head, (socket) => {
      wsServer.emit("connection", socket, request)

      onWebSocketConnect(socket, request)
    })
  })
}

createServer()

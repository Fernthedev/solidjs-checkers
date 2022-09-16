import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import express from "express"

const { PORT = 5173 } = process.env

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Middleware that parses json and looks at requests where the Content-Type header matches the type option.
  app.use(express.json())

  // Serve app production bundle
  app.use(express.static("dist/app"))

  app.get("*", async (_req, res) => {
    res.sendFile(path.join(__dirname, "app/index.html"))
  })

  console.log(`Listening to ${PORT}`)

  app.listen(PORT)
}

createServer()


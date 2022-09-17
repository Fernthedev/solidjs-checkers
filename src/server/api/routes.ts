import express from "express"
import sessionRouter from "./session";

const router = express.Router(

);


router.get("/session", sessionRouter)

export default router
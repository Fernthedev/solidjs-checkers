import express from "express"
import sessionRouter from "./session";

const router = express.Router(

);


router.use("/session", sessionRouter)

export default router

import express, { Router } from "express"
import { getEvents } from "../controller/event.controller"

const router: Router = express.Router()
router.get('/:org/:repo', getEvents)

export default router
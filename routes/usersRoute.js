import { Router } from "express"
import {
  createNewUser,
  getCurrentUser,
  login,
  logout,
} from "../controllers/usersController.js"

const usersRoute = Router()

usersRoute.post("/register", createNewUser)
usersRoute.post("/login", login)
// get the current user in session
usersRoute.get("/session", getCurrentUser)
// terminate the session
usersRoute.post("/logout", logout)

export default usersRoute

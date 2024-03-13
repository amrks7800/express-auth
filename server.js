import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import cors from "cors"
import usersRoute from "./routes/usersRoute.js"

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())

// Routes
app.use("/user", usersRoute)

app.all("*", (req, res) => {
  res
    .status(404)
    .json({ message: `can not get ${req.url}` })
})

app.use((req, res, next) => {
  console.log(
    `
    ${req.url}\t
    ${req.method}\t
    ${new Date().toDateString()}\t
    ${req.cookies}
    `
  )
  next()
})

const PORT = +process.env.PORT || 3500

app.listen(PORT, () =>
  console.log(`server running on port ${PORT}`)
)

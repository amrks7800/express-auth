import bcrypt from "bcrypt"
import pool from "../db/index.js"
import jwt from "jsonwebtoken"
import {
  getUserByEmail,
  getUserByID,
  createNewUserInDB,
} from "../db/user.js"

const createNewUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName || !email || !password)
    return res
      .status(400)
      .json({ message: "all user data are required" })

  try {
    const isDuplicateUser = await getUserByEmail(email)

    if (isDuplicateUser.rows.length)
      return res.status(409).json({
        message:
          "user already exist in db with the same email",
      })

    const hashedPwd = await bcrypt.hash(password, 10)

    const result = await createNewUserInDB(
      firstName,
      lastName,
      email,
      hashedPwd
    )

    if (result.rows)
      return res
        .status(201)
        .json({ message: `created new user` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "all user data are required" })

  try {
    const { rows } = await getUserByEmail(email)

    if (!rows.length)
      return res
        .status(404)
        .json({ message: "user not found" })

    const storedUser = rows[0]

    const isTheSamePwd = await bcrypt.compare(
      password,
      storedUser.password
    )

    if (isTheSamePwd) {
      const token = jwt.sign(
        { id: storedUser.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "43200s" }
      )

      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 43200 * 1000),
      })

      res.status(200).json({ token })
    } else {
      res.status(400).json({ message: "wrong password" })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getCurrentUser = async (req, res) => {
  const { token } = req.cookies

  if (!token)
    return res.status(401).json({ message: "unauthorized" })

  try {
    const decodedToken = jwt.decode(token, { json: true })

    // console.log(decodedToken)

    const { rows } = await getUserByID(decodedToken.id)

    delete rows[0].password

    res.status(200).json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  })

  res.status(200).json({ message: "logged out" })
}

export { createNewUser, login, getCurrentUser, logout }

import pool from "./index.js"

/**
 * retrieve a user from db using email
 * @param {string} email
 * @returns user
 */
const getUserByEmail = async email => {
  const isDuplicateUser = await pool.query(
    "select * from users where email = $1",
    [email]
  )

  return isDuplicateUser
}

/**
 * retrieve a user from db using id
 * @param {string} id
 * @returns user
 */
const getUserByID = async id => {
  const user = await pool.query(
    "select * from users where id = $1",
    [id]
  )

  return user
}

/**
 * creates a new user in db
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} hashedPwd
 * @returns user
 */
const createNewUserInDB = async (
  firstName,
  lastName,
  email,
  hashedPwd
) => {
  const newUser = await pool.query(
    "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
    [firstName, lastName, email, hashedPwd]
  )

  return newUser
}

export { createNewUserInDB, getUserByEmail, getUserByID }

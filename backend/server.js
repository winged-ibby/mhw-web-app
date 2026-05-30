import express from "express"
import cors from "cors"
import "./config.js"
import { pool } from "./db.js"

const app = express()

app.use(cors({
  origin: "*"
}))
app.use(express.json())

const PORT = process.env.PORT || 3001

app.get("/health", (req, res) => {
  res.json({ ok: true })
})

app.get("/monsters", async (req, res) => {
  try {
    const response = await fetch("https://mhw-db.com/monsters")

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to fetch monsters"
      })
    }

    const data = await response.json()

    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: "Server error"
    })
  }
})

app.get("/monsters/:id", async (req, res) => {
  try {
    const response = await fetch(
      `https://mhw-db.com/monsters/${req.params.id}`
    )

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Monster not found"
      })
    }

    const data = await response.json()

    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: "Server error"
    })
  }
})

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "DB connection failed" })
  }
})

app.post("/favorites", async (req, res) => {
  const { user_id, monster_id } = req.body

  try {
    await pool.query(
      "INSERT INTO favorites (user_id, monster_id) VALUES ($1, $2)",
      [user_id, monster_id]
    )

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to add favorite" })
  }
})

app.delete("/favorites", async (req, res) => {
  const user_id = req.query.user_id
  const monster_id = req.query.monster_id

  if (!user_id || !monster_id) {
    return res.status(400).json({ error: "Missing user_id or monster_id" })
  }

  try {
    await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND monster_id = $2",
      [user_id, monster_id]
    )
    res.json({ success: true })
  } catch (err) {
    console.error("DELETE ERROR:", err)
    res.status(500).json({ error: "Failed to remove favorite" })
  }
})

app.get("/favorites/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1",
      [req.params.user_id]
    )

    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favorites" })
  }
})

app.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body)
    const { username, password } = req.body

    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    )

    const user = result.rows[0]

    if (!user || user.password_hash !== password) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    res.json({
      user: {
        id: user.id,
        username: user.username
      }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body

    const existing = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    )

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" })
    }

    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, password]
    )

    res.json({ user: result.rows[0] })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
import pkg from "pg"
import { DATABASE_URL } from "./config.js"

const { Pool } = pkg

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing!")
}

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})
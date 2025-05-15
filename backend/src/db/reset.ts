import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as dotenv from "dotenv"
import { users } from "./schema"
dotenv.config()
if (!process.env.DB_PASSWORD) {
  throw new Error("A variável de ambiente DB_PASSWORD não está definida.")
}
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

const db = drizzle(pool)

async function main() {
  console.log("Resetting database...")
  await db.delete(users)
  console.log("Database reset completed")
  await pool.end()
}

main().catch((err) => {
  console.error("Reset failed")
  console.error(err)
  process.exit(1)
})

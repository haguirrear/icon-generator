
import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core"

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL env")
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export const db = drizzle({ client: pool })


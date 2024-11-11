
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { Resource } from "sst"

console.log("Connecting to db: ", Resource.DATABASE_URL.value)
const client = postgres(Resource.DATABASE_URL.value, { prepare: false })


export const db = drizzle({ client: client, logger: process.env.IS_DEV === "true" })



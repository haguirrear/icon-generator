import { defineConfig } from "drizzle-kit";
import { Resource } from "sst"

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/db/schema",
  dbCredentials: {
    url: Resource.DATABASE_URL.value
  }
})



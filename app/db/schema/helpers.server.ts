import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";


export const timestamps = {
  updatedAt: timestamp("updated_at").$onUpdate(() => sql`now()`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}

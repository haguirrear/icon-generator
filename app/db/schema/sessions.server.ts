import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { userTable } from "./users.server";

import { InferSelectModel } from "drizzle-orm"


export const sessionTable = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: integer("user_id").notNull().references(() => userTable.id),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
})

export type SessionModel = InferSelectModel<typeof sessionTable>

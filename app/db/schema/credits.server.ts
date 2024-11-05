import { integer, pgTable } from "drizzle-orm/pg-core";
import { userTable } from "./users.server";
import { timestamps } from "./helpers.server";

export const creditsTable = pgTable("credits", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => userTable.id),
  credits: integer("credits").notNull().default(0),
  ...timestamps
})

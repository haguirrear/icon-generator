import { InferSelectModel } from "drizzle-orm"
import { integer, jsonb, pgTable, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "./helpers.server"

export const userTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar().unique().notNull(),
  ...timestamps
})


export const oauthProviderList = ["google"] as const

export const authProvidersTable = pgTable("auth_providers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => userTable.id),
  provider: varchar({ enum: oauthProviderList }).notNull(),
  externalUserId: varchar("external_user_id").notNull(),
  userInfo: jsonb("user_info").default({}).notNull(),
  ...timestamps
})

export type User = InferSelectModel<typeof userTable>

export type OauthProvider = typeof oauthProviderList[number]
export type AuthProvider = InferSelectModel<typeof authProvidersTable>

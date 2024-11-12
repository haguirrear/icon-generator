import { InferSelectModel } from "drizzle-orm"
import { boolean, integer, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"
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

export type UserModel = InferSelectModel<typeof userTable>

export type OauthProvider = typeof oauthProviderList[number]
export type AuthProvider = InferSelectModel<typeof authProvidersTable>


export const emailCodeTable = pgTable("email_code", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => userTable.id),
  code: varchar().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean().default(false)
})

export type EmailCode = InferSelectModel<typeof emailCodeTable>

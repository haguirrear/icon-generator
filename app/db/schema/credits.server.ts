import { integer, numeric, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { userTable } from "./users.server";
import { timestamps } from "./helpers.server";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod"

export const creditsConfigTable = pgTable("credits_config", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  creditsPerImage: integer().notNull(),
  ...timestamps
})

export type CreditConfigModel = InferSelectModel<typeof creditsConfigTable>

export const creditsUsersTable = pgTable("credits_users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => userTable.id),
  credits: integer("credits").notNull().default(0),
  ...timestamps
})

// Enums
export const statusList = ["pending", "success", "failure"] as const
export const ReceiptStatusSchema = z.enum(statusList)
export type ReceiptStatus = z.infer<typeof ReceiptStatusSchema>

export const paymentProviderList = ["mercadopago"] as const
export const PaymentProviderSchema = z.enum(paymentProviderList)
export type PaymentProvider = z.infer<typeof PaymentProviderSchema>

export const receiptsTable = pgTable("receipts", {
  id: uuid().primaryKey(),
  provider: varchar({ enum: paymentProviderList }).notNull(),
  providerRefId: varchar("provider_ref_id").notNull(),
  userId: integer("user_id").notNull().references(() => userTable.id),
  credits: integer("credits").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  status: varchar({ enum: statusList }).notNull().default("pending"),
  ...timestamps
})

export type ReceiptsModel = InferSelectModel<typeof receiptsTable>

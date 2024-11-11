import Big from "big.js"
import { db } from "~/db/config.server"
import { receiptsTable } from "~/db/schema/credits.server"


export type CreateReceipt = {
  id: string
  credits: number
  userId: number
  unitPrice: Big
  totalPrice: Big
}

export async function createReceipt(receipt: CreateReceipt) {
  await db.insert(receiptsTable).values({
    id: receipt.id,
    credits: receipt.credits,
    userId: receipt.userId,
    unitPrice: receipt.unitPrice.toFixed(2),
    totalPrice: receipt.totalPrice.toFixed(2),
    status: "pending"
  })
}

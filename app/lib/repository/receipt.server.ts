import { eq } from "drizzle-orm";
import { db } from "~/db/config.server";
import { ReceiptsModel, receiptsTable, ReceiptStatus } from "~/db/schema/credits.server";



export type CreateReceipt = {
  id: string
  credits: number
  userId: number
  unitPrice: Big
  totalPrice: Big
}
export async function createReceiptDb(receipt: CreateReceipt) {
  await db.insert(receiptsTable).values({
    id: receipt.id,
    credits: receipt.credits,
    userId: receipt.userId,
    unitPrice: receipt.unitPrice.toFixed(2),
    totalPrice: receipt.totalPrice.toFixed(2),
    status: "pending"
  })
}

export async function getReceiptDb(id: string): Promise<ReceiptsModel | null> {
  const results = await db.select().from(receiptsTable).where(eq(receiptsTable.id, id))
  if (results.length === 0) {
    return null
  }

  return results[0]
}

export async function updateReceiptDb({ id, status }: { id: string, status: ReceiptStatus }) {
  await db.update(receiptsTable).set({ status: status }).where(eq(receiptsTable.id, id))
}



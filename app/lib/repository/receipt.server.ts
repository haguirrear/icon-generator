import { eq, and } from "drizzle-orm";
import { db } from "~/db/config.server";
import { PaymentProvider, ReceiptsModel, receiptsTable, ReceiptStatus } from "~/db/schema/credits.server";



export type CreateReceipt = {
  id: string
  provider: PaymentProvider
  providerRefId: string
  credits: number
  userId: number
  unitPrice: Big
  totalPrice: Big
}
export async function createReceiptDb(receipt: CreateReceipt) {
  await db.insert(receiptsTable).values({
    id: receipt.id,
    provider: receipt.provider,
    providerRefId: receipt.providerRefId,
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


export async function getReceiptByProviderRefDb({ providerRefId, userId }: { providerRefId: string, userId: number }): Promise<ReceiptsModel | null> {
  const [receipt] = await db.select()
    .from(receiptsTable)
    .where(
      and(
        eq(receiptsTable.userId, userId),
        eq(receiptsTable.providerRefId, providerRefId),
      )
    )

  if (!receipt) {
    return null
  }

  return receipt
}

export async function updateReceiptDb({ id, status }: { id: string, status: ReceiptStatus }) {
  await db.update(receiptsTable).set({ status: status }).where(eq(receiptsTable.id, id))
}



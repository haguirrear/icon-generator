import { eq, sql } from "drizzle-orm";
import { db } from "~/db/config.server";
import { creditsUsersTable, ReceiptsModel, receiptsTable, ReceiptStatus } from "~/db/schema/credits.server";



export async function getReceipt(id: string): Promise<ReceiptsModel | null> {
  const results = await db.select().from(receiptsTable).where(eq(receiptsTable.id, id))
  if (results.length === 0) {
    return null
  }

  return results[0]
}


export async function updateReceipt({ id, status }: { id: string, status: ReceiptStatus }) {
  await db.update(receiptsTable).set({ status: status }).where(eq(receiptsTable.id, id))
}

export async function updateUserCredits({ userId, addCredits }: { userId: number, addCredits: number }) {
  await db.update(creditsUsersTable).set({ credits: sql`credits + ${addCredits}` }).where(eq(creditsUsersTable.userId, userId))
}

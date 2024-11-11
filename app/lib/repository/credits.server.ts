
import Big from "big.js";
import { eq, sql } from "drizzle-orm";
import { db } from "~/db/config.server";
import { CreditConfigModel, creditsConfigTable, creditsUsersTable } from "~/db/schema/credits.server";

const DEFAULT_CREDIT_PRICE = process.env.DEFAULT_CREDIT_PRICE || ""
const DEFAULT_CREDIT_PER_IMAGE = process.env.DEFAULT_CREDIT_PER_IMAGE || ""

export async function getCreditsConfigDb(): Promise<CreditConfigModel> {
  let results = await db.select().from(creditsConfigTable).limit(1)

  if (results.length > 0) {
    return results[0]
  }

  results = await db.insert(creditsConfigTable).values({
    unitPrice: Big(DEFAULT_CREDIT_PRICE).toFixed(2),
    creditsPerImage: Number(DEFAULT_CREDIT_PER_IMAGE),
  }).returning()

  return results[0]
}

export async function getCreditsDb(userId: number): Promise<number> {
  const results = await db.select({ credits: creditsUsersTable.credits })
    .from(creditsUsersTable)
    .where(eq(creditsUsersTable.userId, userId))
    .limit(1)

  if (results.length === 0) {
    await db.insert(creditsUsersTable).values({ userId })
    return 0
  }

  return results[0].credits
}


export async function substractCreditsDb({ userId, credits }: { userId: number, credits: number }) {
  await db.update(creditsUsersTable).set({ credits: sql`credits - ${credits}` }).where(eq(creditsUsersTable.userId, userId))
}
export async function addCreditsDb({ userId, addCredits }: { userId: number, addCredits: number }) {
  await db.update(creditsUsersTable).set({ credits: sql`credits + ${addCredits}` }).where(eq(creditsUsersTable.userId, userId))
}




import { eq } from "drizzle-orm";
import { db } from "~/db/config.server";
import { creditsTable } from "~/db/schema/credits.server";



export async function getCredits(userId: number): Promise<number> {
  const results = await db.select({ credits: creditsTable.credits })
    .from(creditsTable)
    .where(eq(creditsTable.userId, userId))
    .limit(1)

  if (results.length === 0) {
    await db.insert(creditsTable).values({ userId })
    return 0
  }

  return results[0].credits
}

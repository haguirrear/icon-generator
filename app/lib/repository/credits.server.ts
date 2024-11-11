
import { eq } from "drizzle-orm";
import { db } from "~/db/config.server";
import { creditsUsersTable } from "~/db/schema/credits.server";



export async function getCredits(userId: number): Promise<number> {
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

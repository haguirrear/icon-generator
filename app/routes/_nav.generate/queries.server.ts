import { eq, sql } from "drizzle-orm";
import { db } from "~/db/config.server";
import { creditsUsersTable } from "~/db/schema/credits.server";



export async function substractCredits({ userId, credits }: { userId: number, credits: number }) {
  await db.update(creditsUsersTable).set({ credits: sql`credits - ${credits}` }).where(eq(creditsUsersTable.userId, userId))
}

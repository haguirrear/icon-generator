import { eq } from "drizzle-orm";
import { db } from "~/db/config.server";
import { SessionModel, sessionTable } from "~/db/schema/sessions.server";
import { UserModel, userTable } from "~/db/schema/users.server";



export async function getUserSessionDb({ sessionId }: { sessionId: string }): Promise<{ user: UserModel, session: SessionModel } | { user: null, session: null }> {
  const result = await db
    .select({ user: userTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));
  if (result.length < 1) {
    return { session: null, user: null }
  }

  return result[0]
}

export async function createSessionDb(values: { id: string, userId: number, expiresAt: Date }): Promise<SessionModel> {
  const results = await db.insert(sessionTable).values(values).returning();
  if (results.length === 0) {
    throw new Error("Session could not be created: returned 0 results")
  }

  return results[0]
}

export async function updateSessionDb(sessionId: string, { expiresAt }: { expiresAt: Date }) {
  await db
    .update(sessionTable)
    .set({
      expiresAt: expiresAt
    })
    .where(eq(sessionTable.id, sessionId));
}

export async function deleteSessionDb(sessionId: string) {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

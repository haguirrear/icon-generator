import { and, eq, isNull } from "drizzle-orm";
import { db } from "~/db/config.server";
import { UserImageModel, userImageTable, UserModel, userTable } from "~/db/schema/users.server";



export async function getUserByEmail(email: string): Promise<UserModel | null> {
  const results = await db.select().from(userTable)
    .where(eq(userTable.email, email)).limit(1)

  if (results.length === 0) {
    return null
  }

  return results[0]
}

export async function createUserDb({ email }: {
  email: string
}): Promise<UserModel> {
  const [user] = await db.insert(userTable).values({ email })
    .returning()

  return user
}


export async function createUserImage({ prompt, imageKey, userId }: { prompt: string, imageKey: string, userId: number }) {
  await db.insert(userImageTable).values({
    userId,
    prompt,
    imageKey
  })
}

export async function getUserImages(userId: number): Promise<UserImageModel[]> {
  const results = await db.select().from(userImageTable)
    .where(and(
      eq(userImageTable.userId, userId),
      isNull(userImageTable.deletedAt)
    ))

  return results
}

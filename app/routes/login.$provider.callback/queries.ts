
import { and, eq } from "drizzle-orm"
import { db } from "~/db/config.server"
import { authProvidersTable, OauthProvider, userTable } from "~/db/schema/users.server"

export async function getUserOauth(provider: OauthProvider, externalId: string) {
  const result = await db.select({ user: userTable, authProvider: authProvidersTable })
    .from(authProvidersTable)
    .innerJoin(userTable, eq(authProvidersTable.userId, userTable.id))
    .where(and(
      eq(authProvidersTable.provider, provider),
      eq(authProvidersTable.externalUserId, externalId)
    ))

  if (result.length === 0) {
    return { user: null, userInfo: null }
  }

  const { user, authProvider } = result[0];

  return { user, userInfo: authProvider.userInfo }
}

export async function createOauthUser({ externalId, email, userInfo, provider }: {
  externalId: string,
  email: string
  userInfo: unknown,
  provider: OauthProvider
}) {
  const [{ userId }] = await db.insert(userTable).values({ email })
    .returning({ userId: userTable.id })

  await db.insert(authProvidersTable).values({
    userId: userId,
    externalUserId: externalId,
    provider: provider,
    userInfo: userInfo
  })

  return userId
}

import { and, eq, getTableColumns, gte } from "drizzle-orm";
import { db } from "~/db/config.server"
import { authProvidersTable, emailCodeTable, OauthProvider, UserModel, userTable } from "~/db/schema/users.server"

export async function getUserOauthDb({ provider, externalId }: { provider: OauthProvider, externalId: string }) {
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

export async function createOauthUserDb({ externalId, email, userInfo, provider }: {
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

export async function createEmailCodeDb({ code, expiresAt, userId }: { code: string, expiresAt: Date, userId: number }) {
  await db.insert(emailCodeTable).values({
    code,
    expiresAt,
    userId
  })
}

export async function invalidateEmailCodeDb({ code, userId }: { code: string, userId: number }) {
  await db.update(emailCodeTable).set({
    used: true
  }).where(and(
    eq(emailCodeTable.code, code),
    eq(emailCodeTable.userId, userId),
  ))
}

export async function getEmailCodeUserDb({ email, code }: { email: string, code: string }): Promise<UserModel | null> {
  const results = await db.select({ ...getTableColumns(userTable) }).from(emailCodeTable)
    .innerJoin(userTable, eq(emailCodeTable.userId, userTable.id))
    .where(
      and(
        eq(emailCodeTable.code, code),
        eq(emailCodeTable.used, false),
        eq(userTable.email, email),
        gte(emailCodeTable.expiresAt, new Date(Date.now()))
      )
    ).limit(1)

  if (results.length === 0) {
    return null
  }

  return results[0]

}

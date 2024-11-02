import { Session, sessionTable } from "~/db/schema/sessions.server";
import { User, userTable } from "~/db/schema/users.server";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding"
import { sha256 } from "@oslojs/crypto/sha2";
import { db } from "~/db/config.server";
import { eq } from "drizzle-orm";
import { createCookie, redirect } from "@remix-run/node";



const sessionCookie = createCookie("__session", {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
})



export async function setSessionCookieHeader(userId: number): Promise<string> {
  const token = generateSessionToken()
  await createSession(token, userId)

  return sessionCookie.serialize(token)
}


export async function removeSessionCookieHeader(): Promise<string> {
  return sessionCookie.serialize("", { maxAge: undefined, expires: new Date(0) })
}

export async function getUser(request: Request) {
  const cookieHeader = request.headers.get('Cookie')
  const sessionToken = ((await sessionCookie.parse(cookieHeader)) || "") as string

  return (await validateSessionToken(sessionToken)).user
}


export async function getSession(request: Request) {
  const cookieHeader = request.headers.get('Cookie')
  const sessionToken = ((await sessionCookie.parse(cookieHeader)) || "") as string

  return validateSessionToken(sessionToken)
}

export async function getUserOrFail(request: Request) {
  const user = await getUser(request)
  if (!user) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await removeSessionCookieHeader()
      }
    })
  }

  return user
}


export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    // Expires in 30 days
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  };
  await db.insert(sessionTable).values(session);
  return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  if (token === "") {
    return { user: null, session: null }
  }

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({ user: userTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));
  if (result.length < 1) {
    return { user: null, session: null }
  }
  const { user, session } = result[0];

  // Delete if already expired
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { user: null, session: null }
  }

  // If it is about to expire (less than 15 days) we renew the session
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessionTable)
      .set({
        expiresAt: session.expiresAt
      })
      .where(eq(sessionTable.id, session.id));
  }
  return { user, session };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
}



export type SessionValidationResult =
  | { session: Session, user: User }
  | { session: null, user: null }
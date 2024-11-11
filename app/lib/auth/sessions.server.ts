import { SessionModel } from "~/db/schema/sessions.server";
import { UserModel } from "~/db/schema/users.server";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding"
import { sha256 } from "@oslojs/crypto/sha2";
import { createCookie, redirect } from "@remix-run/node";
import { Resource } from "sst";
import { createSessionDb, deleteSessionDb, getUserSessionDb, updateSessionDb } from "../repository/session.server";



const sessionCookie = createCookie("__session", {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.IS_DEV !== "true",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
  secrets: [Resource.SECRET_KEY.value]
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
  const uri = new URL(request.url)
  const currentUri = uri.pathname + "?" + uri.searchParams.toString()
  if (!user) {
    throw redirect("/login?" + new URLSearchParams([["next", currentUri]]).toString(), {
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

export async function createSession(token: string, userId: number): Promise<SessionModel> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  return createSessionDb({
    id: sessionId,
    userId,
    // Expires in 30 days
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  })
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  if (token === "") {
    return { user: null, session: null }
  }

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const { user, session } = await getUserSessionDb({ sessionId })
  if (!user) {
    return { user: null, session: null }
  }

  // Delete if already expired
  if (Date.now() >= session.expiresAt.getTime()) {
    await deleteSessionDb(session.id)
    return { user: null, session: null }
  }

  // If it is about to expire (less than 15 days) we renew the session
  const _15Days = 1000 * 60 * 60 * 24 * 15
  if (Date.now() + _15Days >= session.expiresAt.getTime()) {
    await updateSessionDb(session.id, {
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    })
  }
  return { user, session };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await deleteSessionDb(sessionId)
}



export type SessionValidationResult =
  | { session: SessionModel, user: UserModel }
  | { session: null, user: null }

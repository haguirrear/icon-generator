import { createCookie } from "@remix-run/node"
import { Google, OAuth2Tokens } from "arctic"
import { OauthProvider, oauthProviderList } from "~/db/schema/users.server"
import { ensureEnv } from "~/lib/env.server"

export type OauthCookieValue = {
  state: string
  codeVerifier: string
}

export const oauthCookie = createCookie("oauth_val", {
  httpOnly: true,
  maxAge: 60 * 10,
  sameSite: "lax",
})

const google = new Google(
  ensureEnv("GOOGLE_CLIENT_ID"),
  ensureEnv("GOOGLE_CLIENT_SECRET"),
  `${ensureEnv("BASE_URL")}/login/google/callback`
)


interface Provider {
  validateAuthorizationCode(code: string, codeVerifier: string): Promise<OAuth2Tokens>
  createAuthorizationURL(state: string, codeVerifier: string, scopes: string[]): URL;
}

export function isValidProviderName(value: string): value is OauthProvider {
  return oauthProviderList.includes(value as OauthProvider)
}

export const providersMap = new Map<OauthProvider, Provider>([
  ["google", google]
]
)



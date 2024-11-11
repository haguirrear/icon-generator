import { createCookie } from "@remix-run/node"
import { Google, OAuth2Tokens } from "arctic"
import { Resource } from "sst"
import { OauthProvider, oauthProviderList } from "~/db/schema/users.server"

export type OauthCookieValue = {
  state: string
  codeVerifier: string
  next: string | null
}

export const oauthCookie = createCookie("oauth_val", {
  httpOnly: true,
  maxAge: 60 * 10,
  sameSite: "lax",
  path: "/",
  secure: process.env.IS_DEV !== "true",
  secrets: [Resource.SECRET_KEY.value]
})

const google = new Google(
  Resource.GOOGLE_CLIENT_ID.value,
  Resource.GOOGLE_CLIENT_SECRET.value,
  `${process.env.SITE_URL}/login/google/callback`
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



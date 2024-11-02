
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { generateCodeVerifier, generateState } from "arctic";
import { isValidProviderName, oauthCookie, providersMap } from "~/lib/auth/oauth.server";


export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.provider || !isValidProviderName(params.provider)) {
    return new Response("not found", { status: 404 })
  }

  const provider = providersMap.get(params.provider)
  if (!provider) {
    return new Response("no provider registerd", { status: 500 })
  }

  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const url = provider.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"])

  const oautCookieString = await oauthCookie.serialize({ state, codeVerifier })

  return redirect(url.toString(), {
    headers: {
      "Set-Cookie": oautCookieString
    }
  })
}

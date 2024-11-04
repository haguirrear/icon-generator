import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { decodeIdToken, OAuth2Tokens } from "arctic";
import { createOauthUser, getUserOauth } from "./queries";
import { isValidProviderName, oauthCookie, OauthCookieValue, providersMap } from "~/lib/auth/oauth.server";
import { setSessionCookieHeader } from "~/lib/auth/sessions.server";

type GoogleClaims = {
  sub: string
  name: string
  picture: string
  given_name: string
  family_name: string
  email: string
}


export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.provider || !isValidProviderName(params.provider)) {
    return new Response("not found", { status: 404 })
  }

  const provider = providersMap.get(params.provider)
  if (!provider) {
    return new Response(`No provider registered for ${params.provider}`, { status: 500 })
  }

  const url = new URL(request.url)
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookiesHeader = request.headers.get("cookie")
  const oauthCookieValues = await oauthCookie.parse(cookiesHeader) as OauthCookieValue || null

  const deletedOauthCookie = await oauthCookie.serialize("", { maxAge: undefined, expires: new Date(0) })

  if (code === null || state === null || oauthCookieValues.state === null || oauthCookieValues.codeVerifier === null) {
    console.log("either code, state, storedstate or codeverifier are null")
    return new Response(null, {
      status: 400,
      headers: {
        "Set-Cookie": deletedOauthCookie
      }
    });
  }
  if (state !== oauthCookieValues.state) {
    console.log("state is different than storedState")
    return new Response(null, {
      status: 400,
      headers: {
        "Set-Cookie": deletedOauthCookie
      }
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await provider.validateAuthorizationCode(code, oauthCookieValues.codeVerifier);
  } catch (e) {
    console.log("Invalid code or code client credentials")

    return new Response(null, {
      status: 400,
      headers: {
        "Set-Cookie": deletedOauthCookie
      }
    });
  }

  const claims = decodeIdToken(tokens.idToken()) as GoogleClaims;

  const { user: existingUser } = await getUserOauth(params.provider, claims.sub);
  const next = oauthCookieValues.next || "/"

  if (existingUser !== null) {
    console.log("User exists, redirecting...")
    return redirect(next, {
      headers: [
        ["Set-Cookie", await setSessionCookieHeader(existingUser.id)],
        ["Set-Cookie", deletedOauthCookie]
      ]
    })
  }

  // TODO: Replace this with your own DB query.
  // const user = await createUser(googleUserId, username);
  console.log("User does not exists, creating...")
  const userId = await createOauthUser({
    externalId: claims.sub,
    email: claims.email,
    userInfo: claims,
    provider: params.provider
  })

  return redirect(next, {
    headers: [
      ["Set-Cookie", await setSessionCookieHeader(userId)],
      ["Set-Cookie", deletedOauthCookie]
    ]
  })
}

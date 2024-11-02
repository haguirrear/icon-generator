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

  if (code === null || state === null || oauthCookieValues.state === null || oauthCookieValues.codeVerifier === null) {
    console.log("either code, state, storedstate or codeverifier are null")
    return new Response(null, {
      status: 400
    });
  }
  if (state !== oauthCookieValues.state) {
    console.log("state is different than storedState")
    return new Response(null, {
      status: 400
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await provider.validateAuthorizationCode(code, oauthCookieValues.codeVerifier);
  } catch (e) {
    console.log("Invalid code or code client credentials")

    return new Response(null, {
      status: 400
    });
  }

  const claims = decodeIdToken(tokens.idToken()) as GoogleClaims;

  const { user: existingUser } = await getUserOauth(params.provider, claims.sub);

  if (existingUser !== null) {
    console.log("User exists, redirecting...")
    return redirect("/", {
      headers: {
        "Set-Cookie": await setSessionCookieHeader(existingUser.id)
      }
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

  return redirect("/", {
    headers: {
      "Set-Cookie": await setSessionCookieHeader(userId)
    }
  })
}

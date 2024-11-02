import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getSession, invalidateSession, removeSessionCookieHeader } from "~/lib/auth/sessions.server";


export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not supported", { status: 405 })
  }


  const session = await getSession(request)
  if (!session.user) {
    return redirect("/")
  }

  await invalidateSession(session.session.id)

  return redirect("/", {
    headers: {
      "Set-Cookie": await removeSessionCookieHeader(),
    }
  })
}

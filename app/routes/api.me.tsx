import { LoaderFunctionArgs } from "@remix-run/node";
import { UserData } from "~/hooks/useUser";
import { getUser } from "~/lib/auth/sessions.server";



export async function loader({ request }: LoaderFunctionArgs): Promise<UserData> {
  const user = await getUser(request)

  if (!user) {
    return {
      loggedIn: false,
      email: ""
    }
  }

  return {
    loggedIn: true,
    email: user.email,
  }
}

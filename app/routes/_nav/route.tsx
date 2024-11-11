import { defer, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, ShouldRevalidateFunctionArgs, useLoaderData } from "@remix-run/react"
import NavBar from "~/components/NavBar"
import { getUser } from "~/lib/auth/sessions.server";
import { getCredits } from "~/lib/repository/credits.server";

export function shouldRevalidate({ formMethod, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
  if (formMethod === "GET" || formMethod === undefined) {
    return false
  }

  return defaultShouldRevalidate
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  if (!user) {
    return null
  }

  const credits = await getCredits(user.id)
  return {
    email: user.email,
    credits
  }
}


export default function Layout() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <NavBar email={data?.email} credits={data?.credits} />
      <Outlet />
    </>
  )
}

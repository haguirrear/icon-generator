import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, ShouldRevalidateFunctionArgs, useLoaderData } from "@remix-run/react"
import NavBar from "~/components/NavBar"
import { getUser } from "~/lib/auth/sessions.server";
import { getCreditsDb } from "~/lib/repository/credits.server";

export const shouldRevalidate = (args: ShouldRevalidateFunctionArgs) => {
  console.log("should revalidate navbar, args: ", args)
  if (args.currentUrl.pathname === "/generate" && args.formMethod === "POST") {
    return args.defaultShouldRevalidate
  }

  return false
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  if (!user) {
    return null
  }

  const credits = await getCreditsDb(user.id)
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

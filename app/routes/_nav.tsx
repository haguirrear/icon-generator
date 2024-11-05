import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react"
import NavBar from "~/components/NavBar"
import { getUser } from "~/lib/auth/sessions.server";


export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  return {
    "email": user?.email
  }
}


export default function Layout() {
  const { email } = useLoaderData<typeof loader>();
  return (
    <>
      <NavBar email={email} />
      <Outlet />
    </>
  )
}

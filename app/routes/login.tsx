import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { GoogleSignInButton } from "~/components/login/google";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getUser } from "~/lib/auth/sessions.server";



export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request)
  if (user) {
    return redirect("/")
  }

  return null
}

export default function LoginPage() {

  return <div className="flex flex-col justify-center items-center h-full">
    <div className="py-80">

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription className="pt-4">Login using your preferred method</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <GoogleSignInButton />
        </CardContent>
      </Card>
    </div>
  </div>
}





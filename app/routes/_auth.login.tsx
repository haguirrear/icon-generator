import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
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
  const next = new URL(request.url).searchParams.get("next") || "/"
  const user = await getUser(request)
  if (user) {
    return redirect(next)
  }

  return null
}

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const next = searchParams.get("next") || undefined

  return <div className="flex flex-col justify-center items-center h-screen">
    <div className="py-80">

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription className="pt-4">Login using your preferred method</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <GoogleSignInButton next={next} />
        </CardContent>
      </Card>
    </div>
  </div>
}





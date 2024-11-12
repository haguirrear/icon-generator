import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useNavigation, useSearchParams } from "@remix-run/react";
import { HouseIcon } from "lucide-react";
import { GoogleSignInButton } from "~/components/login/google";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { createEmailCode } from "~/lib/auth/email.server";
import { getUser } from "~/lib/auth/sessions.server";
import { sendEmail } from "~/lib/email/ses";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const next = new URL(request.url).searchParams.get("next") || "/"
  const user = await getUser(request)
  if (user) {
    return redirect(next)
  }

  return null
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const email = String(formData.get("email") || "")
  const next = new URL(request.url).searchParams.get("next") || "/"

  if (email === "") {
    throw new Response("Bad Request", { status: 400 })
  }

  const code = await createEmailCode(email)
  const qp = new URLSearchParams({ email, next })
  if (!code) {
    console.log("not found user with email: ", email)
    return redirect(`/login/email?${qp.toString()}`)
  }

  console.log("code: ", code)

  await sendEmail({
    to: [email],
    subjet: `Icon Generator Pin Code: ${code}`,
    body: `Your pin code is <b>${code}</b>`
  })


  return redirect(`/login/email?${qp.toString()}`)
}

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const navigation = useNavigation()
  const next = searchParams.get("next") || undefined

  return <div className="flex flex-col justify-center items-center h-screen">
    <div className="w-[350px] px-4">
      <div className="flex flex-col items-center justify-start pb-9">
        <div className="py-2"><HouseIcon /></div>
        <h1 className="font-semibold text-xl">Welcome to Icon Generator</h1>
        <p>Sign in to get started.</p>
      </div>
      <Form method="POST">
        <div className="flex flex-col items-stretch gap-5">
          <Input type="email" name="email" placeholder="Email" />
          <Button type="submit" disabled={navigation.state !== "idle"}> {navigation.state === "idle" ? "Sign in with email" : "Submitting..."}</Button>
        </div>
      </Form >
      <div className="flex items-center py-4">
        <Separator className="shrink" />
        <span className="block px-4 text-muted-foreground">or</span>
        <Separator className="shrink" />
      </div>
      <div className="flex flex-col items-stretch">
        <GoogleSignInButton next={next} />
      </div>
    </div>
  </div>
}





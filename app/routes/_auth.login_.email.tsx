import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { HouseIcon } from "lucide-react";
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "~/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useEffect, useRef, useState } from "react";
import { getEmailCodeUserDb } from "~/lib/repository/oauth.server";
import { setSessionCookieHeader } from "~/lib/auth/sessions.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const qp = new URL(request.url).searchParams
  const email = qp.get("email")

  if (!email) {
    throw new Response("Bad Request", { status: 400 })
  }


  return null
}


export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const code = String(formData.get("code") || "").toUpperCase()
  const email = String(formData.get("email") || "").toLowerCase()

  const next = new URL(request.url).searchParams.get("next") || "/"


  if (!email || !code) {
    throw new Response("Bad Request", { status: 400 })
  }

  const user = await getEmailCodeUserDb({ email, code })
  if (!user) {
    return { code: "invalid_code" }
  }

  return redirect(next, {
    headers: [
      ["Set-Cookie", await setSessionCookieHeader(user.id)],
    ]
  })
}

export default function EmailLogin() {
  const [searchParams] = useSearchParams()
  const navigation = useNavigation()
  const data = useActionData<typeof action>()
  const otp = useRef<HTMLInputElement>(null)
  const form = useRef<HTMLFormElement>(null)

  const email = searchParams.get("email") || ""
  const [code, setCode] = useState("")

  useEffect(() => {
    otp.current?.focus()
  }, [])

  return <div className="flex flex-col items-center justify-center h-screen">
    <div className="max-w-screen-sm flex flex-col items-center gap-2">
      <div className="py-2"><HouseIcon /></div>
      <h1 className="font-semibold text-xl">Let's verify your email</h1>
      <p className="pb-6">Check your inbox for the code that was sent to you</p>
      <Form method="POST" ref={form}>
        <input type="hidden" hidden value={email} name="email" readOnly />
        <InputOTP name="code" pattern={REGEXP_ONLY_DIGITS_AND_CHARS} maxLength={6} ref={otp}
          disabled={navigation.state !== "idle"}
          value={code}
          onChange={(value) => {
            setCode(value.toUpperCase())
            if (value.length === 6) {
              form.current?.submit()
            }
          }}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Form>
      {data?.code === "invalid_code" && <div className="text-red-500 text-sm">The code is invalid</div>}
    </div>
  </div>
}

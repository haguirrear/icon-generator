import { json, LoaderFunctionArgs, redirect, TypedResponse } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getReceipt, updateReceipt, updateUserCredits } from "./queries.server";
import { ReceiptStatus, ReceiptStatusSchema } from "~/db/schema/credits.server";
import { Button } from "~/components/ui/button";
import { getUserOrFail } from "~/lib/auth/sessions.server";

type LoaderResponse = { type: "no_order_found", orderId: string } | { type: "success", status: ReceiptStatus, orderId: string, email: string, credits: number }


// TODO: improve security in this callback
export async function loader({ request, params }: LoaderFunctionArgs): Promise<TypedResponse<LoaderResponse>> {
  const searchParams = new URL(request.url).searchParams

  const { success, data: pathStatus } = ReceiptStatusSchema.safeParse(params.pathStatus)
  if (!success) {
    throw new Response(null, { status: 404 })
  }

  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")
  const externalReference = searchParams.get("external_reference")
  const merchantOrderId = searchParams.get("merchant_order_id")


  if (!paymentId || !status || !externalReference || !merchantOrderId) {
    throw json({ errorCode: "missing_parameters" }, 400)
  }

  const user = await getUserOrFail(request)

  console.log("paymentId: ", paymentId)
  console.log("status: ", status)
  console.log("externalReference: ", externalReference)
  console.log("merchantOrderId: ", merchantOrderId)
  console.log("pathStatus: ", pathStatus)

  const receipt = await getReceipt(externalReference)
  if (!receipt) {
    return json({ type: "no_order_found", orderId: externalReference }, 404)
  }

  if (receipt.status !== "pending") {
    throw new Response(null, { status: 404 })
  }

  await updateReceipt({ id: receipt.id, status: pathStatus })
  if (pathStatus === "success") {
    await updateUserCredits({ userId: user.id, addCredits: receipt.credits })
  }

  return redirect("/generate")
}


export default function CallbackPayment() {
  const data = useLoaderData<typeof loader>()


  if (data.type === "no_order_found") {
    return <OrderNotFound orderId={data.orderId} />
  }

  if (data.status === "failure") {
    return <OrderFailure orderId={data.orderId} />
  }

  return <div className="flex flex-col h-full items-center justify-center" >
    {data.status === "pending" && <div>
      Your payment is beign processed. You will receive an email to {data.email} when it is ready!
    </div>}
    {data.status === "success" && <div>
      Your payment was successful. You have bought {data.credits}!
    </div>}
    <Button asChild><Link to="/">Go Home</Link></Button>
  </div>
}

function OrderFailure({ orderId }: { orderId: string }) {
  return <div className="flex flex-col h-full items-center justify-center">
    <div>
      The payment for the order <span className="font-bold">{orderId}</span> was not processed successfuly.
      <br />
      Please try it again.
    </div>
    <Button asChild><Link to="/">Go Home</Link></Button>
  </div>
}

function OrderNotFound({ orderId }: { orderId: string }) {
  return <div className="flex flex-col h-full items-center justify-center">
    <div>
      The order <span className="font-bold">{orderId}</span> was not found.
      <br />
      If you were trying to make a payment. Please try it again.
    </div>
    <Button asChild><Link to="/">Go Home</Link></Button>
  </div>
}

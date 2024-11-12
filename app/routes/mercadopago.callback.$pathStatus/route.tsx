import { json, LoaderFunctionArgs, redirect, TypedResponse } from "@remix-run/node";
import { ReceiptStatus, ReceiptStatusSchema } from "~/db/schema/credits.server";
import { getUserOrFail } from "~/lib/auth/sessions.server";
import { getReceiptDb, updateReceiptDb } from "~/lib/repository/receipt.server";
import { addCreditsDb } from "~/lib/repository/credits.server";

type LoaderResponse = { type: "no_order_found", orderId: string } | { type: "success", status: ReceiptStatus, orderId: string, email: string, credits: number }


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

  console.log("Mercado Pago callback searchParams: ", searchParams)

  const receipt = await getReceiptDb(externalReference)
  if (!receipt) {
    // Fake 404 if no receipt is found
    return redirect("/404")
  }

  const statusUriParams = new URLSearchParams({ refId: receipt.providerRefId }).toString()

  if (receipt.status !== "pending") {
    return redirect(`/payment/status?${statusUriParams}`)
  }

  await updateReceiptDb({ id: receipt.id, status: pathStatus })
  if (pathStatus === "success") {
    await addCreditsDb({ userId: user.id, addCredits: receipt.credits })
    return redirect("/")
  }

  return redirect(`/payment/status?${statusUriParams}`)
}



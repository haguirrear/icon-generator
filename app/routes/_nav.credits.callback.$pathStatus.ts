import { json, LoaderFunctionArgs } from "@remix-run/node";



export async function loader({ request, params }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams

  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")
  const externalReference = searchParams.get("external_reference")
  const merchantOrderId = searchParams.get("merchant_order_id")

  const pathStatus = params.pathStatus

  if (!paymentId || !status || !externalReference || !merchantOrderId || !pathStatus) {
    return json({ type: "error", error: "missing parameters" }, 400)
  }

  console.log("paymentId: ", paymentId)
  console.log("status: ", status)
  console.log("externalReference: ", externalReference)
  console.log("merchantOrderId: ", merchantOrderId)
  console.log("pathStatus: ", paymentId)

}

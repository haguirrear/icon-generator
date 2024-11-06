import { ActionFunctionArgs, json, TypedResponse } from "@remix-run/node";
import { Preference } from "mercadopago";
import { getUnitPrice, mercadoPago } from "~/lib/payments/mercadopago.server";
import { v4 } from "uuid"

type ActionResp = {
  type: "error"
  error: string
} | {
  type: "success"
  preferenceId: string
}


export async function createPreference({ request }: ActionFunctionArgs): Promise<TypedResponse<ActionResp>> {
  const formData = await request.formData()
  const credits = formData.get("credits")
  if (!credits) {
    return json({ type: "error", error: "missing credits" }, 400)
  }

  const creditNum = Number(credits)
  if (isNaN(creditNum)) {
    return json({ type: "error", error: "invalid credit value" }, 400)
  }

  const unitPrice = await getUnitPrice()
  const preference = new Preference(mercadoPago);

  const resp = await preference.create({
    body: {
      items: [
        {
          id: v4(),
          title: "Credits",
          currency_id: "USD",
          quantity: creditNum,
          unit_price: unitPrice
        }
      ],
      auto_return: "approved",
      back_urls: {
        failure: "http://localhost/credits/callback",
        success: "http://localhost/credits/callback",
        pending: "http://localhost/credits/callback"
      }
    }
  })

  if (!resp.id) {
    return json({
      type: "error",
      error: "unknown error"
    })
  }

  return json({
    type: "success",
    preferenceId: resp.id
  }, 200)
}

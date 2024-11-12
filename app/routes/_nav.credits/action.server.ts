import { json, TypedResponse } from "@remix-run/node";
import { Preference } from "mercadopago";
import { getUnitPrice, mercadoPago } from "~/lib/payments/credits.server";
import { v4 } from "uuid"
import actionWithUser from "~/lib/middleware.server";
import { createReceiptDb } from "~/lib/repository/receipt.server";

type ActionResp = {
  type: "error"
  error: string
} | {
  type: "success"
  preferenceId: string
}


export const createPreference = actionWithUser(async (user, { request }): Promise<TypedResponse<ActionResp>> => {
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
  const id = v4()


  const preference = new Preference(mercadoPago);
  const resp = await preference.create({
    body: {
      items: [
        {
          id,
          title: "Credits",
          currency_id: "USD",
          quantity: creditNum,
          unit_price: unitPrice.toNumber()
        }
      ],
      auto_return: "approved",
      external_reference: id,
      back_urls: {
        failure: `${process.env.SITE_URL}/mercadopago/callback/failure`,
        success: `${process.env.SITE_URL}/mercadopago/callback/success`,
        pending: `${process.env.SITE_URL}/mercadopago/callback/pending`
      }
    }
  })

  if (!resp.id) {
    return json({
      type: "error",
      error: "unknown error"
    })
  }

  await createReceiptDb({
    id: id,
    provider: "mercadopago",
    providerRefId: resp.id,
    userId: user.id,
    credits: creditNum,
    unitPrice: unitPrice,
    totalPrice: unitPrice.times(creditNum)
  })


  return json({
    type: "success",
    preferenceId: resp.id
  }, 200)
})

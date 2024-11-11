import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { getUnitPrice } from "~/lib/payments/credits.server";
import { MercadoPago } from "./mercadopago.client";
import { ClientOnly } from "remix-utils/client-only"
import { createPreference } from "./action.server";
import Big from "big.js"

export const action = createPreference
export async function loader() {
  return {
    unitPrice: await getUnitPrice()
  }
}

export default function Route() {
  const data = useLoaderData<typeof loader>()
  const [prefId, setPrefId] = useState("")
  const hasPrefId = prefId !== ""

  const [finishAnim, setFinishAnim] = useState(false)

  useEffect(() => {
    if (hasPrefId) {
      setTimeout(() => setFinishAnim(true), 200)
    }
  }, [hasPrefId])


  return <div className="flex flex-col justify-center items-center h-screen">
    <div className="py-80">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl">Buy Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <CreditForm unitPrice={Big(data.unitPrice)} onConfirm={(prefId) => {
            setPrefId(prefId)
          }} />
          <ClientOnly fallback={<div></div>}>
            {() => <div className={`transition-opacity delay-200 duration-200 ${finishAnim ? "opacity-100" : "opacity-0 hidden"}`}>
              <div className={`text-muted-foreground text-center text-sm pt-4`}>Payment options</div>
              <Separator className="mt-1" />
              {hasPrefId && <MercadoPago preferenceId={prefId} />}
            </div>}
          </ClientOnly>
        </CardContent>
      </Card>
    </div>
  </div >
}

function CreditForm({ unitPrice, onConfirm }: { unitPrice: Big, onConfirm: (prefId: string) => void }) {
  const [credits, setCredits] = useState("")
  const fetcher = useFetcher<typeof action>()
  const [confirmed, setConfirmed] = useState(false)
  const [totalPrice, setTotalPrice] = useState(Big(0))

  const [finishAnimation, setFinisAnimation] = useState(false)

  useEffect(() => {
    if (fetcher.data?.type === "success") {
      setConfirmed(true)
      const prefId = fetcher.data.preferenceId
      setTimeout(() => {
        setFinisAnimation(true)
        onConfirm(prefId)
      }, 300)
    }
  }, [fetcher.data])


  return <fetcher.Form method="post" className="flex flex-col gap-4" >
    <label className="flex flex-col gap-2">
      <span>Amount to add</span>
      <Input type="number" name="credits" placeholder="0" value={credits} disabled={confirmed} onChange={(event) => {
        setCredits(event.target.value.replace(/\D/, ''))
        setTotalPrice(Big(event.target.value).times(unitPrice))
      }} />
      <div className="flex justify-end">
        <div className="text-sm text-muted-foreground">Total: $ {totalPrice.toFixed(2)}</div>
      </div>
    </label>
    <Button
      className={`transition-all delay-100 duration-300 ${confirmed ? "-translate-y-1" : ""} ${finishAnimation ? "hidden" : ""}`}
      disabled={fetcher.state === "submitting" || confirmed}
      type="submit"
    >{confirmed ? "Confirmed" : "Confirm"}</Button>
  </fetcher.Form >
}





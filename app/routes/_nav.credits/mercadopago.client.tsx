import { initMercadoPago, Wallet } from "@mercadopago/sdk-react"
import { useEffect } from "react"



export function MercadoPago({ preferenceId }: { preferenceId: string }) {
  useEffect(() => {
    console.log("loading mercadopago")
    initMercadoPago("APP_USR-fa201f54-6c43-4590-a37e-857ba3d3daa6")
  }, [])

  return <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts: {} }} />
}

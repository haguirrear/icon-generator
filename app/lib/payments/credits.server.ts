
import Big from 'big.js';
import { MercadoPagoConfig } from 'mercadopago';
import { Resource } from "sst"
import { getCreditsConfigDb } from '../repository/credits.server';


export const mercadoPago = new MercadoPagoConfig({ accessToken: Resource.MERCADO_PAGO_ACCESS_TOKEN.value });

export async function getUnitPrice(): Promise<Big> {
  const config = await getCreditsConfigDb()

  return Big(config.unitPrice)
}


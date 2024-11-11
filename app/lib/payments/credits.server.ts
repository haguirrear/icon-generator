
import Big from 'big.js';
import { MercadoPagoConfig } from 'mercadopago';
import { Resource } from "sst"
import { db } from '~/db/config.server';
import { CreditConfigModel, creditsConfigTable } from '~/db/schema/credits.server';

const DEFAULT_CREDIT_PRICE = process.env.DEFAULT_CREDIT_PRICE || ""
const DEFAULT_CREDIT_PER_IMAGE = process.env.DEFAULT_CREDIT_PER_IMAGE || ""

console.log("DEFAULT_CREDIT_PRICE: ", DEFAULT_CREDIT_PRICE)

export const mercadoPago = new MercadoPagoConfig({ accessToken: Resource.MERCADO_PAGO_ACCESS_TOKEN.value });

export async function getUnitPrice(): Promise<Big> {
  const config = await getCreditsConfig()

  return Big(config.unitPrice)
}

export async function getCreditsConfig(): Promise<CreditConfigModel> {
  const results = await db.select().from(creditsConfigTable).limit(1)

  if (results.length === 0) {
    const results = await db.insert(creditsConfigTable).values({
      unitPrice: Big(DEFAULT_CREDIT_PRICE).toFixed(2),
      creditsPerImage: Number(DEFAULT_CREDIT_PER_IMAGE),
    }).returning()

    return results[0]
  }

  return results[0]
}

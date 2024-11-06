
import { MercadoPagoConfig } from 'mercadopago';

export const mercadoPago = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "" });

export async function getUnitPrice(): Promise<number> {
  return 3
}

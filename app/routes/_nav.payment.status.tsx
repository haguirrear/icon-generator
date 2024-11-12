import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { HourglassIcon, OctagonAlertIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { getUserOrFail } from "~/lib/auth/sessions.server";
import { getReceiptByProviderRefDb } from "~/lib/repository/receipt.server";


export async function loader({ request }: LoaderFunctionArgs) {
  const uri = new URL(request.url)
  const providerRefId = uri.searchParams.get("refId")

  if (!providerRefId) {
    throw new Response("Not Found", { status: 404 })
  }

  const user = await getUserOrFail(request)

  const receipt = await getReceiptByProviderRefDb({ providerRefId: providerRefId, userId: user.id })
  if (!receipt) {
    throw new Response("Not Found", { status: 404 })
  }

  return {
    status: receipt.status
  }
}


export default function PaymentStatusRoute() {
  const data = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const providerRefId = searchParams.get("refId") || ""

  return <div className="flex flex-col items-center justify-center h-full">
    <div className="max-w-[500px] bg-muted rounded-xl border border-border">
      {data.status === "failure" ? <FailureCardContent providerRefId={providerRefId} /> : <PendingCardContent providerRefId={providerRefId} />}
    </div>
  </div>

}

function FailureCardContent({ providerRefId }: { providerRefId: string }) {
  return <div className="flex flex-col gap-2 items-center p-10">
    <OctagonAlertIcon className="py-2 text-red-500 w-24 h-24" />
    <h1 className="font-semibold text-xl">Your payment had an error</h1>
    <p>Please contact with support.</p>
    <p className="text-muted-foreground text-xs">Payment ref: {providerRefId}</p>
    <div className="pt-8">
      <Button asChild>
        <Link to="/">Home</Link>
      </Button>
    </div>
  </div>
}


function PendingCardContent({ providerRefId }: { providerRefId: string }) {
  return <div className="flex flex-col gap-2 items-center p-10">
    <HourglassIcon className="py-2 w-24 h-24" />
    <h1 className="font-semibold text-xl">Your payment is processing</h1>
    <p>We will send you an email when it is completed.</p>
    <p className="text-muted-foreground text-xs">Payment ref: {providerRefId}</p>
    <div className="pt-8">
      <Button asChild>
        <Link to="/">Home</Link>
      </Button>
    </div>
  </div>
}

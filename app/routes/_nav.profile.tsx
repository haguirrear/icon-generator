import { Label } from "@radix-ui/react-label"
import { useFetcher, useLoaderData, useRouteLoaderData } from "@remix-run/react"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { loader as navLoader } from "./_nav/route"
import { LoaderFunctionArgs } from "@remix-run/node"
import { getUserOrFail } from "~/lib/auth/sessions.server"
import { Separator } from "~/components/ui/separator"
import { getUserImages as getUserImagesDb } from "~/lib/repository/user.server"
import { Resource } from "sst"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserOrFail(request)

  const images = await getUserImagesDb(user.id)

  images.map((im) => {
    im.imageKey = `https://${Resource.AssetsBucket.name}.s3.us-east-1.amazonaws.com/${im.imageKey}`
  })

  return {
    userId: user.id,
    images
  }
}


export default function ProfileRoute() {
  const navData = useRouteLoaderData<typeof navLoader>("routes/_nav")
  const data = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const [showEdit, setShowEdit] = useState(false)


  return <div className="p-8">
    <section>
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="py-4"> <Separator /> </div>
      <div>
        email: {navData?.email}
      </div>

      <div hidden={!showEdit}>
        <fetcher.Form method="post" className="py-4 max-w-[500px] flex flex-col gap-2" >
          <div className="flex flex-col gap-2">
            <Label> Name </Label>
            <Input type="text"></Input>
          </div>
          <div className="flex flex-col gap-2">
            <Label> Email </Label>
            <Input type="email"></Input>
          </div>
          <div className="flex gap-4 items-center justify-end pt-4">
            <Button className="bg-secondary">Cancel</Button>
            <Button>Save</Button>
          </div>
        </fetcher.Form>
      </div>
    </section>
    <section className="pt-8">
      <h1 className="text-2xl font-semibold">Images</h1>
      <div className="py-4"> <Separator /> </div>
      <div className="grid grid-cols-4 gap-2">
        {data.images.map((im) => <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <img src={im.imageKey} alt="AI generated image" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{im.prompt}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>)}
      </div>
    </section>
  </div>
}

import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import Show from "~/components/utils/Show";
import { ColorOption, colors, styles } from "./form-options";
import { getUser } from "~/lib/auth/sessions.server";
import { redirect, useFetcher, useSearchParams } from "@remix-run/react";
import { generateIconAction } from "./action";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Icon Generator" },
    { name: "description", content: "Icon Generator" },
  ];
};


export const shouldRevalidate = () => false

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser(request)
  if (!user) {
    const currentUrl = new URL(request.url)
    const params = new URLSearchParams()
    params.set("next", currentUrl.pathname + currentUrl.search)
    return redirect(`/login?${params.toString()}`)
  }
  return generateIconAction(request)
}

export default function GenerateIconPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [formValues, setFormValues] = useState({
    prompt: searchParams.get("prompt") || "",
    color: searchParams.get("color") || "",
    style: searchParams.get("style") || "",
  })

  useEffect(() => {
    const newSearchParams = new URLSearchParams()
    if (formValues.prompt) newSearchParams.set("prompt", formValues.prompt)
    if (formValues.color) newSearchParams.set("color", formValues.color)
    if (formValues.style) newSearchParams.set("style", formValues.style)

    setSearchParams(newSearchParams, { replace: true, preventScrollReset: true })
  }, [formValues, setSearchParams])

  const fetcher = useFetcher<typeof action>()
  const isSuccess = fetcher.data?.state === "success"
  const isError = fetcher.data?.state === "error"
  const resultImage = fetcher.data?.state === "success" ? fetcher.data.image : null

  const imageRef = useRef<HTMLDivElement>(null)
  const errRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (fetcher.data?.state !== undefined) {
      const ref = imageRef.current || errRef.current
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [fetcher.data])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container m-auto mb-80 flex flex-col p-8 max-w-screen-md">
      <h1 className="text-3xl font-bold pb-4">Generate AI Logos</h1>
      <p> Your results may vary. We are working on fine tuning results for each style. Here are some tips to make better icons:</p>
      <ul className="list-disc list-inside pl-4">
        <li>Do not ask for words or letters, AI does not generate characters and words correctly</li>
        <li>Simple prompts often work best</li>
        <li>Use variants once you find a starting icon you like</li>
        <li>Experiment with adding words, such as happy or vibrant</li>
      </ul>
      <div className="py-4">
        <fetcher.Form method="post" className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="prompt" className="text-2xl pb-2">
              1. Describe your icon using a noun and adjective
            </label>
            <Input type="text" id="prompt" name="prompt" className="p-2" required value={formValues.prompt} onChange={handleChange} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="color" className="text-2xl pb-2">
              2. Select a primary color for your icon
            </label>
            <div className="grid grid-cols-5 gap-3 p-2">
              {
                colors.map(([color, colorClass]) => (
                  <ColorOption color={color} key={color} checked={formValues.color === color} colorClass={colorClass} onChange={handleChange}></ColorOption>
                ))
              }
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-2xl pb-2">
              3. Select a style for your icon
            </label>
            <RadioGroup defaultValue="metallic" name="style" value={formValues.style} onValueChange={(value) => {
              setFormValues((prev) => ({
                ...prev,
                style: value
              }))
            }}>
              {
                styles.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <RadioGroupItem value={style} id={style} required={true} />
                    <Label htmlFor={style}>{style}</Label>
                  </div>
                ))
              }
            </RadioGroup>
          </div>
          <div>
            <Button type="submit" disabled={fetcher.state === "submitting"}>{fetcher.state === "submitting" ? "Generating ..." : "Generate Icon"}</Button>
          </div>
        </fetcher.Form>
      </div >
      <Show when={isSuccess}>
        <div className="p-4" ref={imageRef}>
          <img src={`data:image/png;base64,${resultImage}`} alt="Generated icon" className="max-w-full rounded-lg object-cover shadow-sm shadow-black" />
        </div>
      </Show>
      <Show when={isError}>
        <Alert variant="destructive" ref={errRef}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error generating the image
          </AlertDescription>
        </Alert>
      </Show>
    </div >
  );
}


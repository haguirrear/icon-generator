import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import Show from "~/components/utils/Show";
import { ColorOption, colors, styles } from "./form-options";
import { Link, useFetcher, useLocation, useSearchParams } from "@remix-run/react";
import { generateIconAction } from "./action.server";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";

export const meta: MetaFunction = () => {
  return [
    { title: "Icon Generator" },
    { name: "description", content: "Icon Generator" },
  ];
};


export const action = generateIconAction

export default function GenerateIconPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [formValues, setFormValues] = useState({
    prompt: searchParams.get("prompt") || "",
    color: searchParams.get("color") || "",
    style: searchParams.get("style") || "",
  })

  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  useEffect(() => {
    const newSearchParams = new URLSearchParams()
    if (formValues.prompt) newSearchParams.set("prompt", formValues.prompt)
    if (formValues.color) newSearchParams.set("color", formValues.color)
    if (formValues.style) newSearchParams.set("style", formValues.style)

    setSearchParams(newSearchParams, { replace: true, preventScrollReset: true })
  }, [formValues, setSearchParams])

  const fetcher = useFetcher<typeof action>()

  useEffect(() => {
    if (fetcher.data?.type === "success" && fetcher.state === "loading") {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    } else if (fetcher.data?.type === "not_enough_credits") {
      setDialogIsOpen(true)
    }
  }, [fetcher.data, fetcher.state])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container m-auto mb-80 flex flex-col p-8 max-w-screen-md">
      <BuyMoreCreditsDialog open={dialogIsOpen} onClose={() => setDialogIsOpen(false)} />
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
          <div className="flex flex-col gap-2">
            <label htmlFor="prompt" className="text-2xl">
              1. Describe your icon using a noun and adjective
              {fetcher.data?.type === "form_error" && fetcher.data.error.prompt !== "" &&
                <span className="pl-4 text-red-500 text-sm">{fetcher.data.error.prompt}</span>
              }
            </label>
            <Input type="text" id="prompt" name="prompt" className="p-2" required value={formValues.prompt} onChange={handleChange} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="color" className="text-2xl pb-2">
              2. Select a primary color for your icon
              {fetcher.data?.type === "form_error" && fetcher.data.error.color !== "" &&
                <span className="pl-4 text-red-500 text-sm">{fetcher.data.error.color}</span>
              }
            </label>
            <div className="grid grid-cols-5 gap-3 p-2">
              {
                colors.map(([color, colorClass]) => (
                  <ColorOption color={color} key={color} checked={formValues.color === color} colorClass={colorClass} onChange={handleChange}></ColorOption>
                ))
              }
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-2xl ">
              3. Select a style for your icon
              {fetcher.data?.type === "form_error" && fetcher.data.error.style !== "" &&
                <span className="pl-4 text-red-500 text-sm">{fetcher.data.error.style}</span>
              }
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
                    <RadioGroupItem value={style} id={style} />
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
      {fetcher.data?.type === "success" &&
        <div className="p-4">
          <img src={fetcher.data.url} alt="Generated icon" className="max-w-full rounded-lg object-cover shadow-sm shadow-black" />
        </div>}
    </div >
  );
}


function BuyMoreCreditsDialog({ open: isOpen = false, onClose }: { open: boolean, onClose?: () => void }) {
  const location = useLocation()
  const nextUrl = `/credits?next=${encodeURIComponent(location.pathname + location.search)}`

  return <AlertDialog open={isOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>You don't have enough credits</AlertDialogTitle>
        <AlertDialogDescription>
          This action needs credits. Do you want to buy some more credits?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Link to={nextUrl}>Buy Credits</Link>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

}

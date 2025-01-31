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
    <div className="container m-auto mb-80 flex flex-col p-8 items-center">
      <div className="max-w-screen-lg flex flex-col items-center">
        <img className="pb-6" src="main-logo.svg" alt="background" />
        <div className="flex gap-8">
          <img src="line.svg" alt="line" />
          <span className="text-primary">Waitlist</span>
          <img className="rotate-180" src="line.svg" alt="line" />
        </div>
        <h1 className="font-satoshi text-9xl font-bold text-center py-8">Create your unique logo</h1>
        <h2 className="font-dmsans text-lg text-center max-w-80 py-4">Fast, simple and easy to user tool suited for your needs.</h2>
      </div>

      <div className="flex min-h-[440px] gap-8 max-w-screen-xl w-full pt-4">
        <div className="flex-1 bg-accent rounded-2xl font-satoshi p-8">
          <h6 className="font-bold  text-xl">Enter the name</h6>
          <p className="text-lg text-muted-foreground">We will use the name to define the industry and the logo generated with AI</p>
        </div>
        <div className="flex-[2] bg-accent rounded-2xl font-satoshi p-8 relative overflow-hidden">
          <h6 className="font-bold  text-xl">Choose the color palette and style</h6>
          <p className="text-lg text-muted-foreground">We will add the style and the magic behind according to what you selected.</p>
          <img className="absolute bottom-0 left-10" src="rainbow-circle.svg" alt="rainbow circle" />
        </div>
        <div className="flex-1 bg-accent rounded-2xl font-satoshi p-8 relative overflow-hidden">
          <h6 className="font-bold  text-xl">All Set!</h6>
          <p className="text-lg text-muted-foreground">You will have a logo tailored to your needs with the option to download in .png or SVG</p>
          <img className="absolute bottom-0 left-0" src="figma.svg" alt="boxes of colors" />
        </div>
      </div>
      <div className="h-52 relative max-w-screen-xl w-full">
        <img className="absolute -top-16" src="planet.png" alt="planet" />
      </div>


      <div className="max-w-screen-md py-8">
        <h2 className="text-7xl font-bold text-center font-satoshi">1. Name</h2>
        <p className="text-xl text-muted-foreground pt-4">Automate design tasks in Figma with a single click</p>
      </div>

      <form action="" className="max-w-screen-sm w-full">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 pointer-events-none flex items-center">
            <img src="sun.svg" alt="sun icon" />
          </div>
          <input className="py-4 pl-12 rounded-3xl w-full bg-accent" type="text" placeholder="Enter your company name" />
          <button className="my-1 mr-1 absolute inset-y-0 right-0 px-6 bg-primary text-primary-foreground rounded-3xl hover:bg-secondary">Continuar</button>
        </div>
      </form>

      <div className="pt-40 text-center w-full max-w-2xl">
        <h2 className="text-5xl font-satoshi font-bold pb-4">Logo Brands</h2>
        <h2 className="text-5xl font-satoshi font-bold bg-gradient-to-r from-purple-700 via-purple-500 to-pink-500 bg-clip-text text-transparent">Case studies</h2>
        <div className="py-20 w-full">
          <div className="rounded-full bg-accent flex justify-evenly items-center font-ubuntu w-full">
            <div className="flex gap-1 px-8 py-4 my-2">
              <img src="analysis.svg" alt="graph icon" />
              <span>All</span>
            </div>
            <div className="flex gap-1 px-8 py-4 m-2 rounded-full bg-primary">
              <img src="analysis.svg" alt="graph icon" />
              <span>Marketing</span>
            </div>
            <div className="flex gap-1 px-8 py-4 my-2">
              <img src="analysis.svg" alt="graph icon" />
              <span>Tecnoligy</span>
            </div>
            <div className="flex gap-1 px-8 py-4 my-2">
              <img src="analysis.svg" alt="graph icon" />
              <span>Marketplace</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] w-full flex flex-col items-center">
        <img src="card.png" alt="cards" />
        <div className="relative w-full">
          <img className="rounded-3xl w-full" src="bg.png" alt="purple bg" />
          <div className="absolute inset-y-0 flex flex-col gap-8 justify-center w-full items-center">
            <h3 className="max-w-screen-md text-5xl font-satoshi text-center">Crafting meaningful connections between businesses and people</h3>
            <button className="rounded-full px-8 py-4 bg-primary-foreground text-black">Generate Logo</button>
          </div>
        </div>
      </div>


      <div className="max-w-[1200px] w-full flex flex-col items-stretch py-16">
        <div className="relative">
          <img className="w-full" src="footer.png" alt="planet" />
          <div className="absolute left-0 right-10 top-10 flex justify-end gap-24">
            <a href="/products">Products</a>
            <a href="/services">Services</a>
            <a href="/Pricing">Pricing</a>
            <a href="/Resources">Resources</a>
          </div>
          <div className="absolute bottom-40 left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
          <div className="absolute left-0 right-0 bottom-20 text-center text-sm text-muted-foreground ">&copy;Cpyright <span id="copyyear">2025</span>. Icon Generator. All right reserved.</div>
        </div>
      </div>


      <div className="h-96"></div>
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

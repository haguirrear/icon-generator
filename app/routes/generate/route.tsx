import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { FourSquare } from "react-loading-indicators";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import Show from "~/components/utils/Show";
import { ColorOption, colors, styles } from "./form-options";
import { getUser } from "~/lib/auth/sessions.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Icon Generator" },
    { name: "description", content: "Icon Generator" },
  ];
};


export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  return {
    "userId": user?.id
  }
}

const generateIcon = async (formData: FormData): Promise<string> => {
  let res = await fetch("/api/generate-icon", {
    method: "POST",
    body: formData
  })

  if (!res.ok) {
    throw new Error("Fail to generate image")
  }

  const b = await res.json()

  return b.image
}

export default function Index() {
  const mutation = useMutation({
    mutationFn: generateIcon,

  })

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
        <form method="post" className="flex flex-col gap-4" onSubmit={(event) => {
          event.preventDefault();
          console.log("Submitting form: ", new FormData(event.currentTarget))
          mutation.mutate(new FormData(event.currentTarget))
        }}>
          <div className="flex flex-col">
            <label htmlFor="prompt" className="text-2xl pb-2">
              1. Describe your icon using a noun and adjective
            </label>
            <Input type="text" id="prompt" name="prompt" className="p-2" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="color" className="text-2xl pb-2">
              2. Select a primary color for your icon
            </label>
            <div className="grid grid-cols-5 gap-3 p-2">
              {
                colors.map(([color, colorClass]) => (
                  <ColorOption color={color} key={color} colorClass={colorClass}></ColorOption>
                ))
              }
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-2xl pb-2">
              3. Select a style for your icon
            </label>
            <RadioGroup defaultValue="metallic" name="style">
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
            <Button type="submit">Generate Icon</Button>
          </div>
        </form>
      </div>
      <Show when={mutation.isPending}>
        <div className="h-[400px]">
          <div className="flex flex-col items-center justify-center h-full">
            <FourSquare color="#7494ae" size="medium" text="Generating Icon" textColor="" />
          </div>
        </div>
      </Show>
      <Show when={mutation.isSuccess}>
        <div className="p-4">
          <img src={`data:image/png;base64,${mutation.data}`} alt="Generated icon" className="max-w-full rounded-lg object-cover shadow-sm shadow-black" />
        </div>
      </Show>
      <Show when={mutation.isError}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error generating the image
          </AlertDescription>
        </Alert>
      </Show>

    </div>
  );
}


import type { MetaFunction } from "@remix-run/node";
import { useMutation } from "@tanstack/react-query";
import { FourSquare } from "react-loading-indicators";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import Show from "~/components/utils/Show";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


const colors = [
  ["red", "bg-red-500"],
  ["orange", "bg-orange-500"],
  ["amber", "bg-amber-500"],
  ["yellow", "bg-yellow-500"],
  ["lime", "bg-lime-500"],
  ["green", "bg-green-500"],
  ["emerald", "bg-emerald-500"],
  ["teal", "bg-teal-500"],
  ["cyan", "bg-cyan-500"],
  ["sky", "bg-sky-500"],
  ["blue", "bg-blue-500"],
  ["indigo", "bg-indigo-500"],
  ["violet", "bg-violet-500"],
  ["purple", "bg-purple-500"],
  ["fuchsia", "bg-fuchsia-500"],
  ["pink", "bg-pink-500"],
  ["rose", "bg-rose-500"],
  ["slate", "bg-slate-500"],
  ["zinc", "bg-zinc-500"],
  ["stone", "bg-stone-500"],
];

const styles = [
  "metallic",
  "polygon",
  "pixelated",
  "clay",
  "gradient",
  "flat",
  "illustrated"
]

const submitForm = async (formData: FormData): Promise<string> => {
  console.log("into mutation data: ", formData.values())

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
    mutationFn: submitForm,

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

    </div>
  );
}


function ColorOption({ color, colorClass }: { color: string, colorClass: string }) {
  return <label className="relative">
    <Input type="radio" name="color" value={color} className="sr-only peer" />
    <span className={`w-10 h-10 rounded-full ${colorClass} block cursor-pointer peer-checked:ring-2 peer-checked:ring-offset-2 hover:opacity-70`}></span>
  </label >
}

import { Input } from "~/components/ui/input";


export const styles = [
  "metallic",
  "polygon",
  "pixelated",
  "clay",
  "gradient",
  "flat",
  "illustrated"
]

export const colors = [
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


export function ColorOption({ color, colorClass, checked, onChange }: { color: string, colorClass: string, checked: boolean, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  return <label className="relative">
    <Input type="radio" name="color" value={color} checked={checked} className="sr-only peer" onChange={onChange} />
    <span className={`w-10 h-10 rounded-full ${colorClass} block cursor-pointer peer-checked:ring-2 peer-checked:ring-offset-2 hover:opacity-70`}></span>
  </label >
}

import { json, TypedResponse } from "@remix-run/node";

import Together from "together-ai";

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });


function buildPrompt(input: { prompt: string, color: string, style: string }): string {
  return `a modern icon in ${input.color} of ${input.prompt}, ${input.style}, minimialistic, high quality, trending on art station, unreal engine graphics quality`;
}

type GenerateIconResponse = {
  state: "error"
  error: string
} | {
  state: "success"
  image: string
}


export async function generateIconAction(request: Request): Promise<TypedResponse<GenerateIconResponse>> {
  const formData = await request.formData()

  const prompt = formData.get("prompt")?.toString()
  const color = formData.get("color")?.toString()
  const style = formData.get("style")?.toString()

  if (!prompt || !color || !style) {
    return json({ state: "error", error: "missing arguments" }, 400)
  }

  const response = await together.images.create({
    model: "black-forest-labs/FLUX.1-schnell-Free",
    prompt: buildPrompt({ prompt, color, style }),
    width: 1024,
    height: 768,
    steps: 1,
    n: 1,
    // @ts-expect-error - this is not typed in the API
    response_format: "b64_json"
  });

  return json({ state: "success", image: response.data[0].b64_json }, 201)
}

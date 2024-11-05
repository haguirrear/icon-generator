import { ActionFunctionArgs, json, redirect, TypedResponse } from "@remix-run/node";

import Together from "together-ai";
import { getUser } from "~/lib/auth/sessions.server";
import { getCredits } from "~/lib/repository/credits.server";
import { error, hasError, Result, success } from "~/lib/result";

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
const IMAGE_CREDIT_COST = 1

type PromptParams = {
  prompt: string
  color: string
  style: string
}

type GenerateIconResponse = {
  type: "form_error"
  error: PromptParams
} | {
  type: "not_enough_credits"
} | {
  type: "success"
  image: string
}

export async function generateIconAction({ request }: ActionFunctionArgs): Promise<TypedResponse<GenerateIconResponse>> {
  const user = await validateUser(request)
  const result = await validateFormData(request)
  if (hasError(result)) {
    return json({
      type: "form_error",
      error: result.error
    }, 422)
  }

  const { prompt, color, style } = result.result
  const credits = await getCredits(user.id)
  if (credits < IMAGE_CREDIT_COST) {
    return json({
      type: "not_enough_credits"
    }, 402)
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

  return json({ type: "success", image: response.data[0].b64_json }, 201)
}

function buildPrompt(params: PromptParams): string {
  return `a modern icon in ${params.color} of ${params.prompt}, ${params.style}, minimialistic, high quality, trending on art station, unreal engine graphics quality`;
}

async function validateUser(request: Request) {
  const user = await getUser(request)
  if (!user) {
    const currentUrl = new URL(request.url)
    const params = new URLSearchParams()
    params.set("next", currentUrl.pathname + currentUrl.search)
    throw redirect(`/login?${params.toString()}`)
  }

  return user
}

async function validateFormData(request: Request): Promise<Result<PromptParams, PromptParams>> {
  const formData = await request.formData()

  const prompt = formData.get("prompt")?.toString()
  const color = formData.get("color")?.toString()
  const style = formData.get("style")?.toString()

  if (!prompt || !color || !style) {
    return error({
      prompt: !prompt ? "* This field is required" : "",
      color: !color ? "* This field is required" : "",
      style: !style ? "* This field is required" : "",
    })
  }


  return success({
    prompt,
    color,
    style
  })
}

import { ActionFunctionArgs, json, redirect, TypedResponse } from "@remix-run/node";
import Together from "together-ai";
import { getUser } from "~/lib/auth/sessions.server";
import { getCredits } from "~/lib/repository/credits.server";
import { error, hasError, Result, success } from "~/lib/result";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { Resource } from "sst";
import { v4 as uuidv4 } from "uuid"
import { fileTypeFromBuffer } from "file-type"
import { substractCredits } from "./queries.server";
import { getCreditsConfig } from "~/lib/payments/credits.server";

const together = new Together({ apiKey: Resource.TOGETHER_API_KEY.value });

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
  url: string
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
  const creditsPromise = getCredits(user.id)
  const creditsConfigPromise = getCreditsConfig()

  const [credits, creditsConfig] = await Promise.all([creditsPromise, creditsConfigPromise])
  if (credits < creditsConfig.creditsPerImage) {
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

  const b64Image = response.data[0].b64_json


  await substractCredits({ userId: user.id, credits: creditsConfig.creditsPerImage })

  const s3Url = await uploadBase64ImageToS3(b64Image, Resource.AssetsBucket.name, uuidv4())

  return json({ type: "success", image: b64Image, url: s3Url }, 201)
}


async function uploadBase64ImageToS3(base64Image: string, bucketName: string, key: string): Promise<string> {
  const buffer = Buffer.from(base64Image, "base64")

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: (await fileTypeFromBuffer(buffer))?.mime
  })

  const s3 = new S3Client({})
  await s3.send(command)

  return `https://${bucketName}.s3.${await s3.config.region()}.amazonaws.com/${key}`
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

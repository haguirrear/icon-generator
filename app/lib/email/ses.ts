import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"
import { Resource } from "sst"

const client = new SESv2Client()

type SendEmailArgs = {
  to: string[]
  body: string
  subjet: string
}

export async function sendEmail(args: SendEmailArgs) {
  await client.send(new SendEmailCommand({
    FromEmailAddress: Resource.EmailProvider.sender,
    Destination: {
      ToAddresses: args.to,
    },
    Content: {
      Simple: {
        Subject: {
          Data: args.subjet,
          Charset: "UTF-8"
        },
        Body: {
          Html: {
            Data: args.body,
            Charset: "UTF-8"
          }
        }
      }
    }
  })
  )
}

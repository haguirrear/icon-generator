/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "icon-generator",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: input.stage === "production" ? "icon-production" : "icon-dev"
        }
      }
    };
  },
  async run() {

    // Secrets
    const DATABASE_URL = new sst.Secret("DATABASE_URL")
    const MERCADO_PAGO_ACCESS_TOKEN = new sst.Secret("MERCADO_PAGO_ACCESS_TOKEN")
    const TOGETHER_API_KEY = new sst.Secret("TOGETHER_API_KEY")
    const GOOGLE_CLIENT_ID = new sst.Secret("GOOGLE_CLIENT_ID")
    const GOOGLE_CLIENT_SECRET = new sst.Secret("GOOGLE_CLIENT_SECRET")
    const SECRET_KEY = new sst.Secret("SECRET_KEY", "S3Critkey")

    // Env Vars
    const hostMap = new Map([
      ["production", ""],
      ["dev", "d1w4cpv7i8zop8.cloudfront.net"]
    ])
    const siteUrlMap = new Map([
      ["production", ""],
      ["dev", `https://${hostMap.get("dev")}`],
    ])


    // Infrastructure

    const bucket = new sst.aws.Bucket("AssetsBucket", {
      access: "public"
    })

    const email = $app.stage === "haguirrear"
      ? sst.aws.Email.get("EmailProvider", "hector.aguirre.arista@gmail.com")
      : new sst.aws.Email("EmailProvider", {
        sender: "hector.aguirre.arista@gmail.com"
      })

    const remixApp = new sst.aws.Remix("RemixApp", {
      link: [
        bucket,
        email,
        DATABASE_URL,
        MERCADO_PAGO_ACCESS_TOKEN,
        TOGETHER_API_KEY,
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        SECRET_KEY,
      ],
      environment: {
        NODE_ENV: ["dev", "production"].includes($app.stage) ? "production" : "dev",
        IS_DEV: $dev.toString(),
        SITE_URL: $dev ? "http://localhost:5173" : siteUrlMap.get($app.stage) || "",
        HOST: $dev ? "localhost" : hostMap.get($app.stage) || "",
        DEFAULT_CREDIT_PRICE: "10",
        DEFAULT_CREDIT_PER_IMAGE: "1",
      }
    });

    // dev
    new sst.x.DevCommand("Studio", {
      link: [DATABASE_URL],
      dev: {
        autostart: true,
        command: "pnpm exec drizzle-kit studio"
      }
    })


    new sst.x.DevCommand("Migrate", {
      link: [DATABASE_URL],
      dev: {
        autostart: false,
        command: "pnpm exec drizzle-kit push"
      }
    })

    return {
      remixAppUrl: remixApp.url,
      EmailProvider: email.getSSTLink().properties.sender
    }
  },
});


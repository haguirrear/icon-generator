import process from "node:process";
import { remixFastify } from "@mcansh/remix-fastify";
import chalk from "chalk";
import { fastify } from "fastify";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install();

const app = fastify({ logger: false });

await app.register(remixFastify);

const host = process.env.HOST || "127.0.0.1";
const desiredPort = Number(process.env.PORT) || 5173;

let address = await app.listen({ port: desiredPort, host });

console.log(chalk.green(`✅ app ready: ${address}`));



export function ensureEnv(envName: string): string {
  const value = process.env[envName]
  if (!value) {
    throw new Error(`enviroment variable is empty: ${envName}`)
  }

  return value
}

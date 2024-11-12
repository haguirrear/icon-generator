import { createEmailCodeDb } from "../repository/oauth.server";
import { createUserDb, getUserByEmail } from "../repository/user.server";


function generateRandomCode({ length }: { length: number }): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  const code = Array.from(array, byte => characters[byte % charactersLength]).join('');

  return code
}

export async function createEmailCode(email: string): Promise<string | null> {
  // 5 min of duration
  const duration = 1000 * 60 * 5
  const code = generateRandomCode({ length: 6 })
  const expiresAt = new Date(Date.now() + duration)

  let user = await getUserByEmail(email)
  if (!user) {
    user = await createUserDb({ email })
  }

  await createEmailCodeDb({
    code, expiresAt, userId: user.id
  })

  return code
}

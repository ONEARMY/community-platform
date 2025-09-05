import { sign, verify as jwtVerify } from 'jsonwebtoken'

import type pkg from 'jsonwebtoken'

const key = process.env.TOKEN_SECRET as string

const generate = (profileId: number, profileCreatedAt: string) => {
  return sign(
    {
      profileId,
      profileCreatedAt,
    },
    key,
  )
}

const verify = (code: string): string | pkg.JwtPayload => {
  return jwtVerify(code, key)
}

export const tokens = { generate, verify }

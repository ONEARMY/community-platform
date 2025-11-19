import pkg from 'jsonwebtoken';

const key = process.env.TOKEN_SECRET as string;

const generate = (profileId: number, profileCreatedAt: string) => {
  return pkg.sign(
    {
      profileId,
      profileCreatedAt,
    },
    key,
  );
};

const verify = (code: string): string | pkg.JwtPayload => {
  return pkg.verify(code, key);
};

export const tokens = { generate, verify };

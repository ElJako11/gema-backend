import { Response } from 'express';
import 'dotenv/config';

export const setCookie = (res: Response, cookieName: string, token: string) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: (process.env.NODE_ENV as string) === 'production',
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24,
  });
};

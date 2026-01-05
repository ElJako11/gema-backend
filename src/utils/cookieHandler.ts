import { Request, Response } from 'express';
import 'dotenv/config';

export const setCookie = (
  req: Request,
  res: Response,
  cookieName: string,
  token: string
) => {
  const origin = req.headers.origin;

  if (!origin) {
    throw new Error('Ha ocurrido un error');
  }

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: (process.env.NODE_ENV as string) === 'production',
    sameSite: origin === 'http://localhost:5173' ? 'lax' : 'none',
    partitioned: origin === 'http://localhost:5173' ? false : true,
    maxAge: 1000 * 60 * 60 * 24,
  });
};

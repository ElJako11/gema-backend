import { Request, Response } from 'express';
import 'dotenv/config';

const getCookieOptions = (origin: string | undefined) => {
  const isLocalhost = origin === 'http://localhost:5173' || !origin;
  const sameSite = isLocalhost ? 'lax' : 'none';
  const partitioned = !isLocalhost;
  // Browser requires Secure to be true if SameSite is None or Partitioned is true
  const secure =
    process.env.NODE_ENV === 'production' || sameSite === 'none' || partitioned;

  const domain = isLocalhost ? 'localhost' : undefined;

  return {
    httpOnly: true,
    secure,
    sameSite,
    partitioned,
    path: '/',
    ...(domain ? { domain } : {}),
  } as const;
};

export const setCookie = (
  req: Request,
  res: Response,
  cookieName: string,
  token: string
) => {
  const origin = req.headers.origin;

  if (process.env.NODE_ENV === 'production' && !origin) {
    throw new Error('Ha ocurrido un error');
  }

  const options = getCookieOptions(origin);
  res.cookie(cookieName, token, options);
};

export const clearCookie = (
  req: Request,
  res: Response,
  cookieName: string
) => {
  const origin = req.headers.origin;

  if (process.env.NODE_ENV === 'production' && !origin) {
    throw new Error('Ha ocurrido un error');
  }

  const options = getCookieOptions(origin);

  const clearOptions = {
    ...options,
    expires: new Date(0),
    maxAge: 0,
  };

  res.cookie(cookieName, '', clearOptions);

  if (options.secure === false) {
    res.cookie(cookieName, '', { ...clearOptions, domain: 'localhost' });
  }

  res.cookie(cookieName, '', { ...clearOptions, path: undefined });
};

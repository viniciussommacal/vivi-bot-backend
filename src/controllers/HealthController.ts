import type { Request, Response } from 'express';

export function health(req: Request, res: Response) {
  res.send('OK!');
}

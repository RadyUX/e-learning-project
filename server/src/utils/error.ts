
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
};
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Token inválido.' });
    }
};
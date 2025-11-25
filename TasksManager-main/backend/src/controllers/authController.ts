import { Request, Response } from 'express';
import { pool } from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("ERRO DETALHADO:", error);

        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (result.rows.length === 0) return res.status(400).json({ error: 'Usuário não encontrado' });
        
        const user = result.rows[0];
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: 'Senha inválida' });

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
        res.status(500).json({ error: 'Erro no login' });
    }
};
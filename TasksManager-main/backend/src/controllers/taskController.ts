import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getTasks = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    try {
        const result = await pool.query(`
            SELECT t.*, c.name as category_name 
            FROM tasks t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.user_id = $1`, 
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
};

export const createTask = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { title, description, category_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, category_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, category_id, userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.json({ message: 'Tarefa deletada' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar' });
    }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { is_completed } = req.body;

    try {
        await pool.query(
            'UPDATE tasks SET is_completed = $1 WHERE id = $2',
            [is_completed, id]
        );
        res.json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar status' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, category_id } = req.body;

    try {
        await pool.query(
            'UPDATE tasks SET title = $1, description = $2, category_id = $3 WHERE id = $4',
            [title, description, category_id, id]
        );
        res.json({ message: 'Tarefa atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
};
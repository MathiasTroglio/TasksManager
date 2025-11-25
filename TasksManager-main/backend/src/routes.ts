import { Router } from 'express';
import * as Auth from './controllers/authController';
import * as Task from './controllers/taskController';
import { authenticateToken } from './middlewares/auth';
import { pool } from './config/db';


const router = Router();

router.post('/signup', Auth.register);
router.post('/login', Auth.login);

router.get('/categories', authenticateToken, async (req, res) => {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
});

router.get('/tasks', authenticateToken, Task.getTasks);
router.post('/tasks', authenticateToken, Task.createTask);
router.delete('/tasks/:id', authenticateToken, Task.deleteTask);
router.patch('/tasks/:id', authenticateToken, Task.updateTaskStatus);
router.put('/tasks/:id', authenticateToken, Task.updateTask);

export default router;
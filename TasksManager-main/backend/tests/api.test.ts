import request from 'supertest';
import app from '../src/server';
import { pool } from '../src/config/db';

let token = '';

beforeAll(async () => {
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM users');
});

afterAll(async () => {
    await pool.end();
});

describe('Auth e Tasks API', () => {
    it('Deve registrar um novo usuário', async () => {
        const res = await request(app)
            .post('/api/signup')
            .send({ username: 'testuser', password: '123' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    it('Deve fazer login e retornar token', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'testuser', password: '123' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('Deve criar uma tarefa (Rota Protegida)', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Jest Test', description: 'Testing API', category_id: 1 });
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toBe('Jest Test');
    });
});
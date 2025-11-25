import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

interface Props { setToken: (t: string) => void; }

export default function Login({ setToken }: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent, isLogin: boolean) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/login' : '/signup';
            const res = await axios.post(`http://localhost:3000/api${endpoint}`, { username, password });
            
            if (isLogin) {
                localStorage.setItem('token', res.data.token);
                setToken(res.data.token);
            } else {
                alert('Registrado! Agora faça login.');
            }
        } catch (err) {
            setError('Erro na autenticação. Verifique credenciais.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }} className="p-4 shadow">
                <h2 className="text-center mb-4">Bem-vindo</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Usuário</Form.Label>
                        <Form.Control type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                    <div className="d-grid gap-2">
                        <Button id="btn-login" variant="primary" onClick={(e) => handleSubmit(e, true)}>Entrar</Button>
                        <Button id="btn-signup" variant="outline-secondary" onClick={(e) => handleSubmit(e, false)}>Registrar</Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
}
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar, Container, Button, Table, Modal, Form, Badge } from 'react-bootstrap';

interface Task { 
    id: number; 
    title: string; 
    description: string; 
    category_name: string;
    category_id: number;
    is_completed: boolean; 
}

interface Category { id: number; name: string; }

export default function Dashboard({ logout }: { logout: () => void }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [show, setShow] = useState(false);
    
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [catId, setCatId] = useState(1);
    
    const [editingId, setEditingId] = useState<number | null>(null);

    const api = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchData = async () => {
        const t = await api.get('/tasks');
        const c = await api.get('/categories');
        setTasks(t.data);
        setCategories(c.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleOpenCreateModal = () => {
        setEditingId(null);
        setTitle('');
        setDesc('');
        setCatId(categories.length > 0 ? categories[0].id : 1);
        setShow(true);
    }

    const handleOpenEditModal = (task: Task) => {
        setEditingId(task.id);
        setTitle(task.title);
        setDesc(task.description);
        setCatId(task.category_id);
        setShow(true);
    }

    const handleSave = async () => {
        if (editingId) {
            await api.put(`/tasks/${editingId}`, { 
                title, 
                description: desc, 
                category_id: catId 
            });
        } else {
            await api.post('/tasks', { 
                title, 
                description: desc, 
                category_id: catId 
            });
        }
        setShow(false);
        fetchData();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir?')) {
            await api.delete(`/tasks/${id}`);
            fetchData();
        }
    }

    const handleToggleStatus = async (task: Task) => {
        await api.patch(`/tasks/${task.id}`, { is_completed: !task.is_completed });
        fetchData();
    };

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>TaskManager</Navbar.Brand>
                    <Button variant="outline-light" onClick={logout}>Sair</Button>
                </Container>
            </Navbar>
            
            <Container className="mt-4">
                <div className="d-flex justify-content-between mb-3">
                    <h3>Minhas Tarefas</h3>
                    <Button id="btn-add-task" onClick={handleOpenCreateModal}>Nova Tarefa</Button>
                </div>
                
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th style={{width: '50px'}}>Status</th>
                            <th>Título</th>
                            <th>Descrição</th> 
                            <th>Categoria</th>
                            <th style={{width: '250px'}}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(t => (
                            <tr key={t.id} style={{ 
                                textDecoration: t.is_completed ? 'line-through' : 'none',
                                opacity: t.is_completed ? 0.5 : 1,
                                backgroundColor: t.is_completed ? '#f8f9fa' : 'inherit'
                            }}>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <Form.Check 
                                        type="checkbox"
                                        checked={t.is_completed}
                                        onChange={() => handleToggleStatus(t)}
                                    />
                                </td>
                                <td>{t.title}</td>
                                <td>{t.description}</td> 
                                <td><Badge bg="info">{t.category_name}</Badge></td>
                                <td>
                                    <Button 
                                        size="sm" 
                                        variant={t.is_completed ? "secondary" : "success"} 
                                        onClick={() => handleToggleStatus(t)}
                                        className="me-2"
                                    >
                                        {t.is_completed ? 'Desfazer' : 'Concluir'}
                                    </Button>

                                    {}
                                    <Button 
                                        size="sm" 
                                        variant="warning" 
                                        className="me-2 text-white"
                                        onClick={() => handleOpenEditModal(t)}
                                    >
                                        Editar
                                    </Button>

                                    <Button size="sm" variant="danger" onClick={() => handleDelete(t.id)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    {}
                    <Modal.Title>{editingId ? 'Editar Tarefa' : 'Nova Tarefa'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Título</Form.Label>
                            <Form.Control 
                                id="task-title" 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                placeholder="Ex: Comprar leite"
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                value={desc} 
                                onChange={e => setDesc(e.target.value)} 
                                placeholder="Detalhes da tarefa..."
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select value={catId} onChange={e => setCatId(Number(e.target.value))}>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
                    <Button id="btn-save-task" variant="primary" onClick={handleSave}>
                        {editingId ? 'Salvar Alterações' : 'Criar Tarefa'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
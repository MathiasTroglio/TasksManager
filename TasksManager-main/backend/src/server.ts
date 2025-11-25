import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', router);

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

export default app;
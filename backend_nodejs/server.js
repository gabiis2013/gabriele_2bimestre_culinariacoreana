const express = require('express');
const CSVHandler = require('./csvHandler');
const path = require('path');

const app = express();
const PORT = 5000;
const csvHandler = new CSVHandler();

// Middleware
app.use(express.json());

// CORS - permitir requisições de qualquer origem
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Dados dos produtos (simulando um banco de dados)
const products = [
    { nome: "Kimchi Jjigae", descricao: "Ensopado apimentado com kimchi e tofu.", imagem: "../imagens/kimchi.png", preco: 21.50, categoria: "apimentados" },
    { nome: "Tteokbokki", descricao: "Bolinhos de arroz cozidos em molho de gojuchang picante.", imagem: "../imagens/tteokbokki.png", preco: 28.00, categoria: "apimentados" },
    { nome: "Buldak", descricao: "Frango grelhado ultra apimentado.", imagem: "../imagens/buldak.png", preco: 32.90, categoria: "apimentados" },
    { nome: "Bibimbap Apimentado", descricao: "Arroz misturado com legumes, carne e pimenta.", imagem: "../imagens/bibimbap.png", preco: 27.00, categoria: "apimentados" },
    { nome: "Jjamppong", descricao: "Sopa de macarrão com frutos-do-mar e caldo vermelho apimentado.", imagem: "../imagens/jjamppong.png", preco: 34.00, categoria: "apimentados" },
    { nome: "Dak Galbi", descricao: "Frango frito com legumes e massa de pimenta gochujang.", imagem: "../imagens/dak galbi.png", preco: 30.00, categoria: "apimentados" },
    { nome: "Sundubu Jjigae", descricao: "Ensopado de tofu macio com frutos-do-mar e pimenta.", imagem: "../imagens/sundubu.png", preco: 26.50, categoria: "apimentados" },
    { nome: "Ojingeo Bokkeum", descricao: "Lula salteada com legumes em molho picante.", imagem: "../imagens/ojingeo bokkeum.png", preco: 33.00, categoria: "apimentados" },
    { nome: "Japchae", descricao: "Macarrão de batata-doce com legumes.", imagem: "./../imagens/Japchae.png", preco: 24.00, categoria: "nao-apimentados" },
    { nome: "Samgyeopsal", descricao: "Churrasco de barriga de porco grelhada.", imagem: "./../imagens/samgyeopsal.png", preco: 30.00, categoria: "nao-apimentados" },
    { nome: "Galbitang", descricao: "Sopa clara de costela bovina.", imagem: "./../imagens/galbitang.png", preco: 26.50, categoria: "nao-apimentados" },
    { nome: "Kimbap", descricao: "Rolinho de arroz com vegetais e carne.", imagem: "./../imagens/kimbap.jpg", preco: 21.75, categoria: "nao-apimentados" }
];

// Rotas da API

// Listar todos os usuários
app.get('/api/users', async (req, res) => {
    try {
        const users = await csvHandler.readUsers();
        res.json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Criar novo usuário
app.post('/api/users', async (req, res) => {
    try {
        const { username, email, tipo } = req.body;
        
        if (!username || !email || !tipo) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const result = await csvHandler.addUser(username, email, tipo);
        
        if (result.success) {
            res.status(201).json({ message: 'Usuário criado com sucesso', user: result.user });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Login de usuário
app.post('/api/login', async (req, res) => {
    try {
        const { username, email } = req.body;
        
        if (!username || !email) {
            return res.status(400).json({ error: 'Username e email são obrigatórios' });
        }

        const user = await csvHandler.findUser(username, email);
        
        if (user) {
            res.json({ 
                success: true, 
                message: 'Login realizado com sucesso',
                user: user 
            });
        } else {
            res.status(404).json({ success: false, error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Atualizar usuário
app.put('/api/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const updateData = req.body;
        
        const result = await csvHandler.updateUser(username, updateData);
        
        if (result.success) {
            res.json({ message: 'Usuário atualizado com sucesso', user: result.user });
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Deletar usuário
app.delete('/api/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        
        const result = await csvHandler.deleteUser(username);
        
        if (result.success) {
            res.json({ message: result.message });
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Listar produtos
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Rota de teste
app.get('/api/test', (req, res) => {
    res.json({ message: 'Servidor Node.js funcionando!' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Node.js rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}/api/test`);
});

module.exports = app;


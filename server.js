const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const JWT_SECRET = "Lavalle";
const app = express();

// Configurações
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Produtos
const produtos = [
    {
        id: 1,
        descricao: "Teclado Mecânico",
        preco: 249.90,
        categoria: "Periféricos",
        estoque: 15
    },
    {
        id: 2,
        descricao: "Mouse Gamer",
        preco: 129.90,
        categoria: "Periféricos",
        estoque: 30
    },
    {
        id: 3,
        descricao: "Headset Gamer",
        preco: 199.90,
        categoria: "Áudio",
        estoque: 20
    },
    {
        id: 4,
        descricao: "Monitor 24 Polegadas",
        preco: 899.90,
        categoria: "Monitores",
        estoque: 10
    },
    {
        id: 5,
        descricao: "Webcam Full HD",
        preco: 159.90,
        categoria: "Acessórios",
        estoque: 25
    }
];

// Usuários
const usuarios = [
    {
        id: 1,
        nome: "Ana Silva",
        login: "ana",
        senha: "123"
    },
    {
        id: 2,
        nome: "Carlos Souza",
        login: "carlos",
        senha: "456"
    }
];

// Listar produtos
app.get('/produtos', (req, res) => {
    res.json(produtos);
});

// Buscar produto por ID
app.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const produto = produtos.find(produto => produto.id === id);

    if (produto) {
        res.json(produto);
    } else {
        res.status(404).send("Produto não encontrado!");
    }
});

// Cadastrar produto
app.post('/produtos', (req, res) => {
    const maiorId = produtos.length
        ? Math.max(...produtos.map(p => p.id))
        : 0;

    const produto = {
        ...req.body,
        id: maiorId + 1
    };

    produtos.push(produto);

    console.log("Produto criado:", produto);

    res.status(201).json({
        mensagem: "Produto cadastrado com sucesso!",
        produto: produto
    });
});

// Alterar produto
app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = produtos.findIndex(produto => produto.id === id);

    if (index !== -1) {
        produtos[index] = {
            ...req.body,
            id: id
        };

        res.json({
            mensagem: "Produto alterado com sucesso!",
            produto: produtos[index]
        });
    } else {
        res.status(404).send("Produto não encontrado!");
    }
});

// Excluir produto
app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = produtos.findIndex(produto => produto.id === id);

    if (index !== -1) {
        produtos.splice(index, 1);

        res.status(200).json({
            mensagem: "Produto deletado com sucesso!"
        });
    } else {
        res.status(404).send("Produto não encontrado!");
    }
});

// Listar usuários (mantido como no código original)
app.get('/login', (req, res) => {
    res.json(usuarios);
});

// Middleware de autenticação
function autenticar(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            mensagem: "Não autenticado"
        });
    }

    try {
        const dados = jwt.verify(token, JWT_SECRET);

        req.usuario = dados;

        next();
    } catch (erro) {
        return res.status(401).json({
            mensagem: "Token inválido ou expirado"
        });
    }
}

// Login
app.post('/login', (req, res) => {
    const { login, senha } = req.body;

    const usuario = usuarios.find(
        u => u.login === login && u.senha === senha
    );

    if (!usuario) {
        return res.status(401).json({
            mensagem: "Login ou senha inválidos"
        });
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            nome: usuario.nome,
            login: usuario.login
        },
        JWT_SECRET,
        {
            expiresIn: "30m"
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 30 * 60 * 1000
    });

    res.status(200).json({
        mensagem: "Login realizado com sucesso"
    });
});

// Consultar usuário autenticado
app.get('/usuario', autenticar, (req, res) => {
    res.json({
        id: req.usuario.id,
        nome: req.usuario.nome,
        login: req.usuario.login
    });
});

// Logout
app.post('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: false
    });

    res.json({
        mensagem: "Logout realizado"
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor ouvindo em http://localhost:3000');
});

/* 

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log('Servidor funcionando')
})
    
*/
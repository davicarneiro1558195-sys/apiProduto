const express = require('express')
const app = express()

app.use(express.json())

const produtos = [
    {
        "id": 1,
        "descricao": "Teclado Mecânico",
        "preco": 249.90,
        "categoria": "Periféricos",
        "estoque": 15
    },
    {
        "id": 2,
        "descricao": "Mouse Gamer",
        "preco": 129.90,
        "categoria": "Periféricos",
        "estoque": 30
    },
    {
        "id": 3,
        "descricao": "Headset Gamer",
        "preco": 199.90,
        "categoria": "Áudio",
        "estoque": 20
    },
    {
        "id": 4,
        "descricao": "Monitor 24 Polegadas",
        "preco": 899.90,
        "categoria": "Monitores",
        "estoque": 10
    },
    {
        "id": 5,
        "descricao": "Webcam Full HD",
        "preco": 159.90,
        "categoria": "Acessórios",
        "estoque": 25
    }
]

app.get('/produtos', (req, res) => {
    res.send(produtos)
})

app.get('/produtos/:id', (req, res) => {

    const id = parseInt(req.params.id)

    const produto = produtos.find(produto => produto.id === id)


    if (produto) {
        res.json(produto)
    } else {
        res.status(404)
        res.send("Produto não encontrado!")
    }
})

app.post('/produtos', (req, res) => {

    const maiorId = Math.max(...produtos.map(p => p.id))

    const produto = {
        id: maiorId + 1,
        ...req.body
    }


    produtos.push(produto)
    res.status(201)
    console.log("Created")
    res.json(produto)

})

app.put('/produtos/:id', (req, res) => {

    const id = parseInt(req.params.id)

    const index = produtos.findIndex(produto => produto.id === id)

    if (index != -1) {

        produtos[index] = {
            id: id,
            ...req.body
        }

        res.json(produtos[index])

    } else {
        res.status(404)
        res.send("Produto não encontrado!")
    }
})

app.delete('/produtos/:id', (req, res) => {

    const id = parseInt(req.params.id)

    const index = produtos.findIndex(produto => produto.id === id)


    if (index != -1) {
        res.status(204)
        produtos.splice(index, 1)
        res.json(produtos)
        res.send("Produto deletado!")
    } else {
        res.status(404)
        res.send("Produto não encontrado!")
    }
})

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log('Servidor funcionando')
})


/* 

    app.listen(3000, (e) => {
    console.log('Servidor ouvindo em http://localhost:3000')
})
*/
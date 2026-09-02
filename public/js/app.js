const lista = document.getElementById("listaProdutos");
const form = document.getElementById("formProduto");
const btnSalvar = document.getElementById("btnSalvar");
const btnEditar = document.getElementById("btnEditar");
const btnExcluir = document.getElementById("btnExcluir");
const link = "http://localhost:3000"

async function listarProdutos() {
    const resposta = await fetch(`${link}/produtos`)

    const produtos = await resposta.json()

    lista.innerHTML = ""

    produtos.forEach(produto => {
        const linha = document.createElement("tr")

        linha.innerHTML = `
        <td>${produto.id}</td>
        <td>${produto.descricao}</td>
        <td>${produto.preco.toFixed(2)}</td>
        <td>${produto.categoria}</td>
        <td>${produto.estoque}</td>
        
        `

        linha.addEventListener("click", () => {
            carregarProduto(produto.id);
        });
        lista.appendChild(linha)
    });
}

async function carregarProduto(id) {
    const resposta = await fetch(`${link}/produtos/${id}`)

    const produto = await resposta.json()

    document.getElementById("id").value = produto.id;

    document.getElementById("descricao").value = produto.descricao;

    document.getElementById("preco").value = produto.preco;

    document.getElementById("categoria").value = produto.categoria;

    document.getElementById("estoque").value = produto.estoque;
}

async function salvarProduto() {

    const id = Number(document.getElementById("id").value);

    const respostaId = await fetch(`${link}/produtos/${id}`);

    if (respostaId.ok) {
        alert("Esse ID já existe!");
    } else {
        const produto = {
            descricao: document.getElementById("descricao").value,
            preco: Number(document.getElementById("preco").value),
            categoria: document.getElementById("categoria").value,
            estoque: Number(document.getElementById("estoque").value)
        };

        const resposta = await fetch(`${link}/produtos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        const dados = await resposta.json();

        alert(dados.mensagem);

        form.reset();
        listarProdutos()
    }


}

async function editarProduto(id) {
    const produto = {
        descricao: document.getElementById("descricao").value,
        preco: Number(document.getElementById("preco").value),
        categoria: document.getElementById("categoria").value,
        estoque: Number(document.getElementById("estoque").value)

    }

    const resposta = await fetch(`${link}/produtos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    });

    const dados = await resposta.json();

    alert(dados.mensagem);

    form.reset()
    listarProdutos()

}

async function excluirProduto(id) {
    const resposta = await fetch(`${link}/produtos/${id}`, {
        method: "DELETE"
    });

    const dados = await resposta.json();

    alert(dados.mensagem);

    form.reset();
    listarProdutos();
}

btnSalvar.addEventListener("click", () => {

    const id = document.getElementById("id").value

    salvarProduto()

})

btnEditar.addEventListener("click", () => {
    const id = Number(document.getElementById("id").value)
    editarProduto(id)
})

btnExcluir.addEventListener("click", () => {
    const id = Number(document.getElementById("id").value)
    excluirProduto(id)
})

listarProdutos()
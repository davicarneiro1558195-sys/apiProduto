const lista = document.getElementById("listaProdutos");
const form = document.getElementById("formProduto");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnEditar = document.getElementById("btnEditar");
const btnExcluir = document.getElementById("btnExcluir");

async function listarProdutos() {
    const resposta = await fetch("/produtos")

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
    const resposta = await fetch(`/produtos/${id}`)

    const produto = await resposta.json()

    document.getElementById("id").value = produto.id;

    document.getElementById("descricao").value = produto.descricao;

    document.getElementById("preco").value = produto.preco;

    document.getElementById("categoria").value = produto.categoria;

    document.getElementById("estoque").value = produto.estoque;
}

async function adicionarProduto() {

    const id = document.getElementById("id").value;

    if (!form.checkValidity()) {
        alert("Preencha o formulário corretamente.") 
    } else {

        const respostaId = await fetch(`/produtos/${Number(id)}`);

        if (respostaId.ok) {
            alert("Esse ID já existe!");
        } else {

            const produto = {
                descricao: document.getElementById("descricao").value,
                preco: Number(document.getElementById("preco").value),
                categoria: document.getElementById("categoria").value,
                estoque: Number(document.getElementById("estoque").value)
            };

            const resposta = await fetch("/produtos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            });

            const dados = await resposta.json();

            alert(dados.mensagem);

            form.reset();
            listarProdutos();
        }
    }
}

async function editarProduto(id) {

    if (!form.checkValidity()) {
        alert("Preencha o formulário corretamente.") 
    }else{
        const produto = {
        descricao: document.getElementById("descricao").value,
        preco: Number(document.getElementById("preco").value),
        categoria: document.getElementById("categoria").value,
        estoque: Number(document.getElementById("estoque").value)

    }

    const resposta = await fetch(`/produtos/${id}`, {
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
    

}

async function excluirProduto(id) {

    if (!form.checkValidity()) {
        alert("Preencha o formulário corretamente.") 
    }else{
        const resposta = await fetch(`/produtos/${id}`, {
        method: "DELETE"
    });

    const dados = await resposta.json();

    alert(dados.mensagem);

    form.reset();
    listarProdutos();
    }
}

btnAdicionar.addEventListener("click", () => {
    adicionarProduto()

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
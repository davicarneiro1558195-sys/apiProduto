async function carregarUsuario() {

    const resposta = await fetch("/usuario");

    if (resposta.status === 401) {
        window.location.href = "/login.html";
        return;
    }

    const usuario = await resposta.json();

    document.getElementById("usuario").textContent =
        `Olá, ${usuario.nome}`;
}

document.getElementById("logout").addEventListener("click", async () => {

    await fetch("/logout", {
        method: "POST"
    });

    window.location.href = "/login.html";
});

carregarUsuario();
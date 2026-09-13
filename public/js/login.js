document.getElementById("loginForm").addEventListener("submit", async (event) => {

    event.preventDefault();

    const login = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;

    const resposta = await fetch("/login", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            login,
            senha
        })
    });

    const dados = await resposta.json();
    alert(dados.mensagem);
    if (resposta.ok) {
        window.location.href = "/home.html";
    }
});
/*Por que o JavaScript consegue acessar esse cookie? 
    resposta: O JavaScript consegue acessar esse cookie porque ele não possui a flag HttpOnly. 
    Quando um cookie não é marcado como HttpOnly,
    ele fica disponível para scripts da página através de document.cookie.
*/

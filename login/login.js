async function fazerLogin() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const email = document.getElementById("email").value;
    
    if (!usuario || !senha || !email) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    try {
        // Enviar credenciais para o servidor
        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: usuario,
                email: email
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            const userType = data.user.tipo;
            
            // Verificar senha para gerentes
            if (userType === "gerente" && senha !== "culinaria.adm") {
                alert("Senha incorreta para gerente!");
                return;
            }
            
            // Verificar senha para clientes (pode implementar lógica específica)
            if (userType === "cliente" && senha.length < 6) {
                alert("Senha deve ter pelo menos 6 caracteres!");
                return;
            }

            alert("Login realizado com sucesso!");
            
            if (userType === "cliente") {
                // Como não temos valorTotal no servidor, vamos para pagina2
                window.location.href = "../pagina2/pagina2.html";
            } else if (userType === "gerente") {
                window.location.href = "../pagina_gerente/pagina_gerente.html";
            }
        } else {
            // Usuário não encontrado, redirecionar para cadastro
            alert("Usuário não encontrado. Por favor, cadastre-se.");
            irParaCadastro();
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro de conexão com o servidor. Tente novamente.");
    }
}

function irParaCadastro() {
    // Redirecionar para a página de cadastro
    window.location.href = "../cadastro/cadastro.html";
}


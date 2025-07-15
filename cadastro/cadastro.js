let userType = 

document.addEventListener("DOMContentLoaded", function() {
    const userTypeDisplay = document.getElementById("userTypeDisplay");
    userTypeDisplay.textContent = "Cadastro";

    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                finalizarCadastro();
            }
        });
    });
});

async function finalizarCadastro() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const email = document.getElementById("email").value;
    
    if (!usuario || !senha || !email) {
        alert("Por favor, preencha todos os campos!");
        return;
    }
    
    if (senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres!");
        return;
    }

    let userType = "cliente"; // Define como cliente por padrão

    // Lógica para determinar se é gerente
    if (senha === "culinaria.adm" && email.endsWith("@adm.com")) {
        userType = "gerente";
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Por favor, insira um e-mail válido!");
            return;
        }
    }
    
    try {
        // Enviar dados para o servidor
        const response = await fetch("http://localhost:5000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: usuario,
                email: email,
                tipo: userType
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Cadastro realizado com sucesso!");
            
            if (userType === "cliente") {
                // Como não temos valorTotal no servidor, vamos para pagina2
                window.location.href = "../pagina2/pagina2.html";
            } else if (userType === "gerente") {
                window.location.href = "../pagina_gerente/pagina_gerente.html";
            }
        } else {
            alert("Erro no cadastro: " + data.error);
        }
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        alert("Erro de conexão com o servidor. Tente novamente.");
    }
}

// Função removida pois não é mais necessária com o armazenamento no servidor
// function adicionarUsuarioALista(nome, email, tipo) {
//     // Esta função agora é redundante pois os dados são salvos no CSV via API
//     // Mantida apenas para compatibilidade
//     let usuarios = [];
//     const usuariosCadastrados = localStorage.getItem("usuariosCadastrados");
    
//     if (usuariosCadastrados) {
//         usuarios = JSON.parse(usuariosCadastrados);
//     }
    
//     const usuarioExistente = usuarios.find(u => u.email === email);
    
//     if (!usuarioExistente) {
//         usuarios.push({
//             nome: nome,
//             email: email,
//             tipo: tipo
//         });
        
//         localStorage.setItem("usuariosCadastrados", JSON.stringify(usuarios));
//     }
// }


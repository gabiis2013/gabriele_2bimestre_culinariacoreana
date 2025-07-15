let escolha = "";

function mostrarApimentados() {
  document.getElementById("resultado").innerHTML = "Você escolheu pratos apimentados.";
  escolha = "apimentados";
  document.getElementById("botao-escolher").style.display = "inline-block";
}

function mostrarSemPimenta() {
  document.getElementById("resultado").innerHTML = "Você escolheu pratos não apimentados.";
  escolha = "nao-apimentados";
  document.getElementById("botao-escolher").style.display = "inline-block";
}

function ESCOLHER() {
  // Redireciona para pagina2.html com o tipo de prato na URL
  window.location.href = `../pagina2/pagina2.html?tipoPrato=${escolha}`;
}

// Função para verificar e exibir o usuário logado (agora via API ou sessão, não localStorage)
async function verificarUsuarioLogado() {
  // Esta função agora deve obter o status do login do servidor, se necessário.
  // Por enquanto, apenas esconde a div, pois o login é gerenciado pelo servidor.
  const usuarioLogadoDiv = document.getElementById("usuario-logado");
  usuarioLogadoDiv.style.display = "none";
}

// Chamar a função quando a página carregar
document.addEventListener("DOMContentLoaded", function() {
  verificarUsuarioLogado();
});



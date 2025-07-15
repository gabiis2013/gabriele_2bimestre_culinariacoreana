const API_BASE_URL = 'http://localhost:5000/api';
let carrinho = [];
let valorTotal = 0;

document.addEventListener("DOMContentLoaded", async () => {
  // Em um cenário real, o carrinho e o valor total viriam do servidor
  // Por simplicidade, vamos simular que o carrinho é passado de pagina2
  // ou que o servidor tem um endpoint para recuperar o carrinho da sessão.
  // Para este exercício, vamos assumir que o carrinho está vazio ao carregar a página 3
  // e que o valor total é 0, a menos que seja passado via URL ou sessão do servidor.

  // Se o carrinho for passado via URL (ex: ?carrinho=[...]), você precisaria parsear aqui.
  // Ou, se houver um endpoint para obter o carrinho da sessão do usuário logado:
  // carrinho = await fetch(`${API_BASE_URL}/user_cart`).then(res => res.json());

  const itensCarrinhoDiv = document.getElementById("itens-carrinho");
  if (carrinho.length === 0) {
    itensCarrinhoDiv.innerHTML = "<p>Seu carrinho está vazio.</p>";
  } else {
    carrinho.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item-carrinho");
      itemDiv.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}" style="width: 50px; height: auto;">
        <p>${item.quantidade}x ${item.nome} - R$ ${(item.quantidade * item.preco).toFixed(2)}</p>
      `;
      itensCarrinhoDiv.appendChild(itemDiv);
    });
  }

  document.getElementById("resumoPagamento").textContent = `Total: R$ ${valorTotal.toFixed(2)}`;

  document.getElementById("gerarPix").addEventListener("click", gerarPix);
  document.getElementById("finalizar").addEventListener("click", finalizarCompra);
  document.getElementById("editarPedido").addEventListener("click", editarPedido);
  document.getElementById("cancelarPedido").addEventListener("click", cancelarPedido);
});

async function finalizarCompra() {
  alert("Compra finalizada com sucesso!");
  // Em um cenário real, você enviaria uma requisição para o backend para finalizar a compra
  // e limpar o carrinho no servidor.
  // Ex: await fetch(`${API_BASE_URL}/checkout`, { method: 'POST', body: JSON.stringify({ carrinho: carrinho, total: valorTotal }) });
  window.location.href = "../pagina1/pagina1.html";
}

function gerarPix() {
  if (valorTotal <= 0) {
    alert("Não há itens no carrinho para gerar PIX!");
    return;
  }

  const qrcodeArea = document.getElementById("qrcode-area");
  const qrcodeDiv = document.getElementById("qrcode");
  
  // Limpar QR code anterior
  qrcodeDiv.innerHTML = "";
  
  // Gerar QR code com dados do PIX
  const pixData = `00020126580014BR.GOV.BCB.PIX0136${generateRandomKey()}5204000053039865802BR5925Comida Coreana LTDA6009SAO PAULO62070503***6304${generateChecksum()}`;
  
  new QRCode(qrcodeDiv, {
    text: pixData,
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
  
  qrcodeArea.style.display = "block";
  alert(`PIX gerado! Valor: R$ ${valorTotal.toFixed(2)}`);
}

function editarPedido() {
  window.location.href = "../pagina2/pagina2.html";
}

function cancelarPedido() {
  if (confirm("Tem certeza que deseja cancelar o pedido?")) {
    // Em um cenário real, você enviaria uma requisição para o backend para cancelar o pedido
    // e limpar o carrinho no servidor.
    // Ex: await fetch(`${API_BASE_URL}/cancel_order`, { method: 'POST' });
    alert("Pedido cancelado!");
    window.location.href = "../pagina1/pagina1.html";
  }
}

function generateRandomKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateChecksum() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

// Função para verificar e exibir o usuário logado (agora via API ou sessão, não localStorage)
async function verificarUsuarioLogado() {
  // Esta função precisaria de um endpoint no backend para verificar o status de login
  // Por simplicidade, vamos apenas esconder a div, pois o login é gerenciado pelo servidor.
  const usuarioLogadoDiv = document.getElementById("usuario-logado");
  usuarioLogadoDiv.style.display = "none";
}

// Chamar a função quando a página carregar
document.addEventListener("DOMContentLoaded", function() {
  verificarUsuarioLogado();
});



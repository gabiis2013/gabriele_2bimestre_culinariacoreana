const API_BASE_URL = 'http://localhost:5000/api';
let carrinho = [];
let todosOsProdutos = [];

// Função para obter o tipo de prato da URL
function getTipoPratoFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('tipoPrato');
}

// Carregar produtos do servidor
async function carregarProdutos() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (response.ok) {
      todosOsProdutos = await response.json();
      const tipoPrato = getTipoPratoFromUrl();
      let pratosParaExibir = [];

      if (tipoPrato === 'apimentados') {
        pratosParaExibir = todosOsProdutos.filter(p => p.categoria === 'apimentados');
        criarHTML(pratosParaExibir, 'Pratos Tradicionais Apimentados');
      } else if (tipoPrato === 'nao-apimentados') {
        pratosParaExibir = todosOsProdutos.filter(p => p.categoria === 'nao-apimentados');
        criarHTML(pratosParaExibir, 'Pratos Tradicionais Não Apimentados');
      } else {
        criarHTML(todosOsProdutos, 'Todos os Pratos');
      }
    } else {
      console.error('Erro ao carregar produtos:', response.statusText);
      alert('Erro ao carregar produtos. Verifique se o servidor está rodando.');
    }
  } catch (error) {
    console.error('Erro ao conectar com a API:', error);
    alert('Erro de conexão com o servidor. Tente novamente.');
  }
}

// Carregar carrinho do servidor (se o usuário estiver logado)
async function carregarCarrinho() {
  // Esta função precisaria de um endpoint no backend para carregar o carrinho do usuário logado
  // Por simplicidade, vamos manter o carrinho vazio no início e adicionar itens.
  // Em um cenário real, o backend gerencia o carrinho associado à sessão do usuário.
  carrinho = []; // Reinicia o carrinho localmente
  document.getElementById("total-carrinho").textContent = calcularTotalCarrinho().toFixed(2);
}

function criarHTML(pratos, titulo) {
  let html = `<h2>${titulo}</h2>`;

  if (pratos.length === 0) {
    html += `<p>Nenhum produto disponível nesta categoria.</p>`;
  } else {
    pratos.forEach((prato) => {
      const quantidadeInicial = 0;
      const nomePratoFormatado = prato.nome.replace(/\s/g, "_");

      html += `
        <div class="prato">
          <img src="${prato.imagem}" alt="${prato.nome}" style="width: 200px; height: auto;">
          <div class="prato-info">
            <h3>${prato.nome}</h3>
            <p>${prato.descricao}</p>
            <p>Preço unitário: R$ ${prato.preco.toFixed(2)}</p>
            <div id="controle-${nomePratoFormatado}">
              <p>Quantidade: <span id="quantidade-${nomePratoFormatado}">${quantidadeInicial}</span></p>
              <button onclick="aumentarQuantidade('${nomePratoFormatado}')">▲</button>
              <button id="diminuir-${nomePratoFormatado}" onclick="diminuirQuantidade('${nomePratoFormatado}')" style="display: none;">▼</button>
              <p>Preço total: R$ <span id="preco-${nomePratoFormatado}">${(quantidadeInicial * prato.preco).toFixed(2)}</span></p>
              <button onclick="adicionarAoCarrinho('${nomePratoFormatado}')">Adicionar ao Carrinho</button>
            </div>
          </div>
        </div>
      `;
    });
  }

  html += `<div class="carrinho"><strong>Total do Carrinho: R$ <span id="total-carrinho">${calcularTotalCarrinho().toFixed(2)}</span></strong></div>`;
  document.getElementById("pratos").innerHTML = html;
}

function aumentarQuantidade(nomePratoFormatado) {
  const quantidadeSpan = document.getElementById(`quantidade-${nomePratoFormatado}`);
  const botaoDiminuir = document.getElementById(`diminuir-${nomePratoFormatado}`);
  const prato = todosOsProdutos.find(p => p.nome.replace(/\s/g, "_") === nomePratoFormatado);

  let quantidade = parseInt(quantidadeSpan.textContent);
  quantidade += 1;
  quantidadeSpan.textContent = quantidade;

  if (quantidade >= 1) {
    botaoDiminuir.style.display = "inline";
  }

  atualizarPreco(nomePratoFormatado);
}

function diminuirQuantidade(nomePratoFormatado) {
  const quantidadeSpan = document.getElementById(`quantidade-${nomePratoFormatado}`);
  const botaoDiminuir = document.getElementById(`diminuir-${nomePratoFormatado}`);
  const prato = todosOsProdutos.find(p => p.nome.replace(/\s/g, "_") === nomePratoFormatado);

  let quantidade = parseInt(quantidadeSpan.textContent);
  if (quantidade > 0) {
    quantidade -= 1;
    quantidadeSpan.textContent = quantidade;

    if (quantidade === 0) {
      botaoDiminuir.style.display = "none";
    }

    atualizarPreco(nomePratoFormatado);
  }
}

function atualizarPreco(nomePratoFormatado) {
  const prato = todosOsProdutos.find(p => p.nome.replace(/\s/g, "_") === nomePratoFormatado);
  const precoSpan = document.getElementById(`preco-${nomePratoFormatado}`);
  const quantidade = parseInt(document.getElementById(`quantidade-${nomePratoFormatado}`).textContent);
  precoSpan.textContent = (quantidade * prato.preco).toFixed(2);
  document.getElementById("total-carrinho").textContent = calcularTotalCarrinho().toFixed(2);
}

async function adicionarAoCarrinho(nomePratoFormatado) {
  const prato = todosOsProdutos.find(p => p.nome.replace(/\s/g, "_") === nomePratoFormatado);
  const quantidade = parseInt(document.getElementById(`quantidade-${nomePratoFormatado}`).textContent);

  if (quantidade === 0) {
    alert("Por favor, selecione uma quantidade antes de adicionar ao carrinho.");
    return;
  }

  // Adicionar ou atualizar item no carrinho local
  const itemExistente = carrinho.find(item => item.nome === prato.nome);
  if (itemExistente) {
    itemExistente.quantidade = quantidade;
  } else {
    carrinho.push({ ...prato, quantidade: quantidade });
  }

  // Em um cenário real, você enviaria isso para o backend para persistir o carrinho
  // Ex: await fetch(`${API_BASE_URL}/cart`, { method: 'POST', body: JSON.stringify(carrinho) });

  alert(`Você adicionou ${quantidade} unidade(s) de ${prato.nome} ao carrinho.`);
  document.getElementById("total-carrinho").textContent = calcularTotalCarrinho().toFixed(2);
}

function calcularTotalCarrinho() {
  return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

function verCarrinho() {
  const modal = document.getElementById("modal-carrinho");
  const itensModalDiv = document.getElementById("itens-modal-carrinho");
  const totalModalP = document.getElementById("total-modal-carrinho");

  if (carrinho.length === 0) {
    itensModalDiv.innerHTML = "<p>Seu carrinho está vazio.</p>";
  } else {
    let html = "";
    carrinho.forEach((item, index) => {
      html += `
        <div class="item-carrinho-modal" id="item-modal-${index}">
          <img src="${item.imagem}" alt="${item.nome}" style="width: 60px; height: auto;">
          <div class="item-info">
            <h4>${item.nome}</h4>
            <div class="controles-carrinho">
              <button onclick="diminuirQuantidadeModal(${index})" class="btn-quantidade">-</button>
              <span class="quantidade-modal">Quantidade: ${item.quantidade}</span>
              <button onclick="aumentarQuantidadeModal(${index})" class="btn-quantidade">+</button>
            </div>
            <p class="preco-item">Preço: R$ ${(item.quantidade * item.preco).toFixed(2)}</p>
            <button onclick="removerItemCarrinho(${index})" class="btn-remover">🗑️ Remover</button>
          </div>
        </div>
      `;
    });
    itensModalDiv.innerHTML = html;
  }

  totalModalP.textContent = `Total: R$ ${calcularTotalCarrinho().toFixed(2)}`;
  modal.style.display = "block";
}

function fecharCarrinho() {
  document.getElementById("modal-carrinho").style.display = "none";
}

async function continuarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio! Adicione alguns itens antes de continuar.");
    return;
  }
  
  // Em um cenário real, você enviaria o carrinho para o backend para finalizar a compra
  // e o backend verificaria o status de login do usuário.
  // Por simplicidade, vamos apenas redirecionar.
  window.location.href = "../pagina3/pagina3.html";
}

// Funções para gerenciar o carrinho no modal
function aumentarQuantidadeModal(index) {
  carrinho[index].quantidade += 1;
  atualizarModalCarrinho();
  atualizarTotalPagina();
}

function diminuirQuantidadeModal(index) {
  if (carrinho[index].quantidade > 1) {
    carrinho[index].quantidade -= 1;
    atualizarModalCarrinho();
    atualizarTotalPagina();
  } else {
    removerItemCarrinho(index);
  }
}

function removerItemCarrinho(index) {
  const nomeItem = carrinho[index].nome;
  carrinho.splice(index, 1);
  
  atualizarInterfacePagina(nomeItem);
  atualizarModalCarrinho();
  atualizarTotalPagina();
  
  alert(`Item removido do carrinho!`);
}

function atualizarModalCarrinho() {
  const itensModalDiv = document.getElementById("itens-modal-carrinho");
  const totalModalP = document.getElementById("total-modal-carrinho");

  if (carrinho.length === 0) {
    itensModalDiv.innerHTML = "<p>Seu carrinho está vazio.</p>";
  } else {
    let html = "";
    carrinho.forEach((item, index) => {
      html += `
        <div class="item-carrinho-modal" id="item-modal-${index}">
          <img src="${item.imagem}" alt="${item.nome}" style="width: 60px; height: auto;">
          <div class="item-info">
            <h4>${item.nome}</h4>
            <div class="controles-carrinho">
              <button onclick="diminuirQuantidadeModal(${index})" class="btn-quantidade">-</button>
              <span class="quantidade-modal">Quantidade: ${item.quantidade}</span>
              <button onclick="aumentarQuantidadeModal(${index})" class="btn-quantidade">+</button>
            </div>
            <p class="preco-item">Preço: R$ ${(item.quantidade * item.preco).toFixed(2)}</p>
            <button onclick="removerItemCarrinho(${index})" class="btn-remover">🗑️ Remover</button>
          </div>
        </div>
      `;
    });
    itensModalDiv.innerHTML = html;
  }

  totalModalP.textContent = `Total: R$ ${calcularTotalCarrinho().toFixed(2)}`;
}

function atualizarTotalPagina() {
  const totalElement = document.getElementById("total-carrinho");
  if (totalElement) {
    totalElement.textContent = calcularTotalCarrinho().toFixed(2);
  }
}

function atualizarInterfacePagina(nomeItemRemovido) {
  const prato = todosOsProdutos.find(p => p.nome === nomeItemRemovido.replace(/_/g, " "));
  if (prato) {
    const quantidadeSpan = document.getElementById(`quantidade-${nomeItemRemovido}`);
    const precoSpan = document.getElementById(`preco-${nomeItemRemovido}`);
    const botaoDiminuir = document.getElementById(`diminuir-${nomeItemRemovido}`);
    
    if (quantidadeSpan) {
      quantidadeSpan.textContent = "0";
      precoSpan.textContent = "0.00";
      botaoDiminuir.style.display = "none";
    }
  }
}

// Função para verificar e exibir o usuário logado (agora via API ou sessão, não localStorage)
async function verificarUsuarioLogado() {
  // Esta função precisaria de um endpoint no backend para verificar o status de login
  // Por simplicidade, vamos apenas esconder a div, pois o login é gerenciado pelo servidor.
  const usuarioLogadoDiv = document.getElementById("usuario-logado");
  usuarioLogadoDiv.style.display = "none";
}

// Chamar as funções quando a página carregar
document.addEventListener("DOMContentLoaded", function() {
  verificarUsuarioLogado();
  carregarProdutos();
  carregarCarrinho(); // Carrega o carrinho (vazio ou do servidor, se implementado)
});



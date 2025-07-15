// Configuração da API
const API_BASE_URL = 'http://localhost:5000/api';

let usuarios = [];
let usuarioEditandoUsername = null;

// Carregar usuários da API
async function carregarUsuarios() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (response.ok) {
            usuarios = await response.json();
            renderizarUsuarios();
        } else {
            console.error('Erro ao carregar usuários:', response.statusText);
            mostrarMensagem('Erro ao carregar usuários. Verifique se o servidor está rodando.', 'error');
        }
    } catch (error) {
        console.error('Erro ao conectar com a API:', error);
        mostrarMensagem('Erro ao conectar com o servidor. Verifique se o servidor está rodando.', 'error');
    }
}

function renderizarUsuarios() {
    const tbody = document.getElementById('usuarios-lista');
    const emptyMessage = document.getElementById('empty-message');
    
    if (usuarios.length === 0) {
        tbody.innerHTML = '';
        emptyMessage.style.display = 'block';
        return;
    }
    
    emptyMessage.style.display = 'none';
    tbody.innerHTML = '';
    
    usuarios.forEach((usuario) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.username}</td>
            <td>${usuario.email}</td>
            <td>${usuario.tipo === 'gerente' ? 'Gerente' : 'Cliente'}</td>
            <td class="user-actions">
                <button class="btn btn-warning" onclick="editarUsuario('${usuario.username}')">Editar</button>
                <button class="btn btn-danger" onclick="excluirUsuario('${usuario.username}')">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function adicionarUsuario() {
    const username = document.getElementById('novo-username').value.trim();
    const email = document.getElementById('novo-email').value.trim();
    const tipo = document.getElementById('novo-tipo').value;
    
    if (!username || !email) {
        mostrarMensagem('Nome de usuário e email são obrigatórios!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                tipo: tipo
            })
        });
        
        if (response.ok) {
            const novoUsuario = await response.json();
            usuarios.push(novoUsuario);
            renderizarUsuarios();
            limparFormularioAdicionar();
            fecharModalAdicionar();
            mostrarMensagem('Usuário adicionado com sucesso!', 'success');
        } else {
            const errorData = await response.json();
            mostrarMensagem(errorData.error || 'Erro ao adicionar usuário', 'error');
        }
    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        mostrarMensagem('Erro ao conectar com o servidor', 'error');
    }
}

function editarUsuario(username) {
    const usuario = usuarios.find(u => u.username === username);
    if (!usuario) return;
    
    usuarioEditandoUsername = username;
    
    document.getElementById('editar-username').value = usuario.username;
    document.getElementById('editar-email').value = usuario.email;
    document.getElementById('editar-tipo').value = usuario.tipo;
    
    document.getElementById('modal-editar').style.display = 'block';
}

async function salvarEdicaoUsuario() {
    const username = document.getElementById('editar-username').value.trim();
    const email = document.getElementById('editar-email').value.trim();
    const tipo = document.getElementById('editar-tipo').value;
    
    if (!username || !email) {
        mostrarMensagem('Nome de usuário e email são obrigatórios!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${usuarioEditandoUsername}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                tipo: tipo
            })
        });
        
        if (response.ok) {
            const usuarioAtualizado = await response.json();
            const index = usuarios.findIndex(u => u.username === usuarioEditandoUsername);
            if (index !== -1) {
                usuarios[index] = usuarioAtualizado;
            }
            renderizarUsuarios();
            fecharModalEditar();
            mostrarMensagem('Usuário atualizado com sucesso!', 'success');
        } else {
            const errorData = await response.json();
            mostrarMensagem(errorData.error || 'Erro ao atualizar usuário', 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        mostrarMensagem('Erro ao conectar com o servidor', 'error');
    }
}

async function excluirUsuario(username) {
    const usuario = usuarios.find(u => u.username === username);
    if (!usuario) return;
    
    if (confirm(`Tem certeza que deseja excluir o usuário "${usuario.username}"?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${username}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                usuarios = usuarios.filter(u => u.username !== username);
                renderizarUsuarios();
                mostrarMensagem('Usuário excluído com sucesso!', 'success');
            } else {
                mostrarMensagem('Erro ao excluir usuário', 'error');
            }
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            mostrarMensagem('Erro ao conectar com o servidor', 'error');
        }
    }
}

function abrirModalAdicionar() {
    document.getElementById('modal-adicionar').style.display = 'block';
}

function fecharModalAdicionar() {
    document.getElementById('modal-adicionar').style.display = 'none';
    limparFormularioAdicionar();
}

function fecharModalEditar() {
    document.getElementById('modal-editar').style.display = 'none';
    usuarioEditandoUsername = null;
}

function limparFormularioAdicionar() {
    document.getElementById('novo-username').value = '';
    document.getElementById('novo-email').value = '';
    document.getElementById('novo-tipo').value = 'cliente';
}

function voltarPaginaGerente() {
    window.location.href = 'pagina_gerente.html';
}

function mostrarMensagem(mensagem, tipo) {
    // Criar elemento de mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}`;
    messageDiv.textContent = mensagem;
    
    // Adicionar estilos
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.padding = '15px 20px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.fontWeight = 'bold';
    
    if (tipo === 'success') {
        messageDiv.style.backgroundColor = '#4CAF50';
        messageDiv.style.color = 'white';
    } else if (tipo === 'error') {
        messageDiv.style.backgroundColor = '#f44336';
        messageDiv.style.color = 'white';
    }
    
    document.body.appendChild(messageDiv);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    carregarUsuarios();
    
    // Event listener para o formulário de adicionar usuário
    document.getElementById('form-adicionar').addEventListener('submit', function(e) {
        e.preventDefault();
        adicionarUsuario();
    });
    
    // Event listener para o formulário de editar usuário
    document.getElementById('form-editar').addEventListener('submit', function(e) {
        e.preventDefault();
        salvarEdicaoUsuario();
    });
    
    // Fechar modais ao clicar fora deles
    window.onclick = function(event) {
        const modalAdicionar = document.getElementById('modal-adicionar');
        const modalEditar = document.getElementById('modal-editar');
        
        if (event.target === modalAdicionar) {
            fecharModalAdicionar();
        }
        if (event.target === modalEditar) {
            fecharModalEditar();
        }
    }
});


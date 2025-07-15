import os
from flask import Blueprint, jsonify, request
from flask_cors import CORS
from src.utils.csv_handler import CSVUserHandler

user_bp = Blueprint('user', __name__)
CORS(user_bp)

# Inicializar o handler do CSV
csv_file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'users.csv')
csv_handler = CSVUserHandler(csv_file_path)

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = csv_handler.get_all_users()
    return jsonify(users)

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.json
    
    # Validar dados obrigatórios
    if not data.get('username') or not data.get('email'):
        return jsonify({'error': 'Username e email são obrigatórios'}), 400
    
    # Tentar adicionar o usuário
    success, message = csv_handler.add_user(
        username=data['username'],
        email=data['email'],
        tipo=data.get('tipo', 'cliente')
    )
    
    if success:
        # Retornar o usuário criado
        user = csv_handler.get_user_by_credentials(data['username'], data['email'])
        return jsonify(user), 201
    else:
        return jsonify({'error': message}), 400

@user_bp.route('/users/<username>', methods=['GET'])
def get_user(username):
    users = csv_handler.get_all_users()
    user = next((u for u in users if u['username'] == username), None)
    
    if user:
        return jsonify(user)
    else:
        return jsonify({'error': 'Usuário não encontrado'}), 404

@user_bp.route('/users/<username>', methods=['PUT'])
def update_user(username):
    data = request.json
    
    success, message = csv_handler.update_user(
        old_username=username,
        new_username=data.get('username'),
        new_email=data.get('email'),
        new_tipo=data.get('tipo')
    )
    
    if success:
        # Retornar o usuário atualizado
        new_username = data.get('username', username)
        users = csv_handler.get_all_users()
        user = next((u for u in users if u['username'] == new_username), None)
        return jsonify(user)
    else:
        return jsonify({'error': message}), 400

@user_bp.route('/users/<username>', methods=['DELETE'])
def delete_user(username):
    success, message = csv_handler.delete_user(username)
    
    if success:
        return '', 204
    else:
        return jsonify({'error': message}), 404

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Validar dados obrigatórios
    if not data.get('username') or not data.get('email'):
        return jsonify({'error': 'Username e email são obrigatórios'}), 400
    
    # Buscar usuário pelas credenciais
    user = csv_handler.get_user_by_credentials(data['username'], data['email'])
    
    if user:
        return jsonify({
            'success': True,
            'message': 'Login realizado com sucesso',
            'user': user
        }), 200
    else:
        return jsonify({
            'success': False,
            'error': 'Credenciais inválidas'
        }), 401


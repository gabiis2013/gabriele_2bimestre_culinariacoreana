from flask import Blueprint, jsonify, request

product_bp = Blueprint("product_bp", __name__)

# Dados de produtos (simulando um banco de dados)
products_data = [
    {"nome": "Kimchi Jjigae", "descricao": "Ensopado apimentado com kimchi e tofu.", "imagem": "../imagens/kimchi.png", "preco": 21.50, "categoria": "apimentados"},
    {"nome": "Tteokbokki", "descricao": "Bolinhos de arroz cozidos em molho de gojuchang picante.", "imagem": "../imagens/tteokbokki.png", "preco": 28.00, "categoria": "apimentados"},
    {"nome": "Buldak", "descricao": "Frango grelhado ultra apimentado.", "imagem": "../imagens/buldak.png", "preco": 32.90, "categoria": "apimentados"},
    {"nome": "Bibimbap Apimentado", "descricao": "Arroz misturado com legumes, carne e pimenta.", "imagem": "../imagens/bibimbap.png", "preco": 27.00, "categoria": "apimentados"},
    {"nome": "Jjamppong", "descricao": "Sopa de macarrão com frutos-do-mar e caldo vermelho apimentado.", "imagem": "../imagens/jjamppong.png", "preco": 34.00, "categoria": "apimentados"},
    {"nome": "Dak Galbi", "descricao": "Frango frito com legumes e massa de pimenta gochujang.", "imagem": "../imagens/dak galbi.png", "preco": 30.00, "categoria": "apimentados"},
    {"nome": "Sundubu Jjigae", "descricao": "Ensopado de tofu macio com frutos-do-mar e pimenta.", "imagem": "../imagens/sundubu.png", "preco": 26.50, "categoria": "apimentados"},
    {"nome": "Ojingeo Bokkeum", "descricao": "Lula salteada com legumes em molho picante.", "imagem": "../imagens/ojingeo bokkeum.png", "preco": 33.00, "categoria": "apimentados"},
    {"nome": "Japchae", "descricao": "Macarrão de batata-doce com legumes.", "imagem": "./../imagens/Japchae.png", "preco": 24.00, "categoria": "nao-apimentados"},
    {"nome": "Samgyeopsal", "descricao": "Churrasco de barriga de porco grelhada.", "imagem": "./../imagens/samgyeopsal.png", "preco": 30.00, "categoria": "nao-apimentados"},
    {"nome": "Galbitang", "descricao": "Sopa clara de costela bovina.", "imagem":  "./../imagens/galbitang.png", "preco": 26.50, "categoria": "nao-apimentados"},
    {"nome": "Kimbap", "descricao": "Rolinho de arroz com vegetais e carne.", "imagem":  "./../imagens/kimbap.jpg", "preco": 21.75, "categoria": "nao-apimentados"}
]

@product_bp.route("/products", methods=["GET"])
def get_products():
    return jsonify(products_data), 200

# Em um cenário real, o carrinho seria gerenciado por sessão ou associado a um usuário logado.
# Para este exercício, vamos simular que o carrinho é passado no frontend.
# Se fosse necessário persistir o carrinho no backend, teríamos endpoints como:
# @product_bp.route("/cart", methods=["POST"])
# def update_cart():
#     data = request.get_json()
#     # Lógica para salvar o carrinho no servidor (ex: em um arquivo, DB, ou sessão)
#     return jsonify({"message": "Carrinho atualizado com sucesso"}), 200

# @product_bp.route("/cart", methods=["GET"])
# def get_cart():
#     # Lógica para recuperar o carrinho do servidor
#     return jsonify([]), 200 # Retorna carrinho vazio por enquanto

# @product_bp.route("/checkout", methods=["POST"])
# def checkout():
#     data = request.get_json()
#     # Lógica para finalizar a compra e limpar o carrinho no servidor
#     return jsonify({"message": "Compra finalizada com sucesso"}), 200



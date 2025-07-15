#!/usr/bin/env python3

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask
from src.models.user import db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'src', 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

with app.app_context():
    db.init_app(app)
    db.drop_all()
    db.create_all()
    print('Banco de dados recriado com sucesso!')
    
    # Adicionar um usuário de teste
    test_user = User(username='admin', email='admin@adm.com', tipo='gerente')
    db.session.add(test_user)
    db.session.commit()
    print('Usuário de teste adicionado: admin@adm.com (gerente)')


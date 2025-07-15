import csv
import os

class CSVUserHandler:
    def __init__(self, csv_file_path):
        self.csv_file_path = csv_file_path
        self.ensure_csv_exists()
    
    def ensure_csv_exists(self):
        """Garante que o arquivo CSV existe com o cabeçalho correto"""
        if not os.path.exists(self.csv_file_path):
            with open(self.csv_file_path, 'w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerow(['username', 'email', 'tipo'])
    
    def read_users(self):
        """Lê todos os usuários do CSV"""
        users = []
        try:
            with open(self.csv_file_path, 'r', newline='', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    users.append(row)
        except FileNotFoundError:
            pass
        return users
    
    def user_exists(self, username=None, email=None):
        """Verifica se um usuário já existe pelo username ou email"""
        users = self.read_users()
        for user in users:
            if username and user['username'] == username:
                return True
            if email and user['email'] == email:
                return True
        return False
    
    def get_user_by_credentials(self, username, email):
        """Busca um usuário pelas credenciais de login"""
        users = self.read_users()
        for user in users:
            if user['username'] == username and user['email'] == email:
                return user
        return None
    
    def add_user(self, username, email, tipo='cliente'):
        """Adiciona um novo usuário ao CSV"""
        # Verificar se o usuário já existe
        if self.user_exists(username=username, email=email):
            return False, "Usuário ou email já existe"
        
        # Validar tipo de usuário
        if tipo not in ['cliente', 'gerente']:
            return False, "Tipo deve ser cliente ou gerente"
        
        # Validar email para gerente
        if tipo == 'gerente' and not email.endswith('@adm.com'):
            return False, "Para ser gerente, o email deve terminar com @adm.com"
        
        # Adicionar usuário ao CSV
        with open(self.csv_file_path, 'a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([username, email, tipo])
        
        return True, "Usuário criado com sucesso"
    
    def get_all_users(self):
        """Retorna todos os usuários"""
        return self.read_users()
    
    def update_user(self, old_username, new_username=None, new_email=None, new_tipo=None):
        """Atualiza um usuário existente"""
        users = self.read_users()
        user_found = False
        
        for i, user in enumerate(users):
            if user['username'] == old_username:
                user_found = True
                
                # Verificar se novo username já existe
                if new_username and new_username != old_username:
                    if self.user_exists(username=new_username):
                        return False, "Username já existe"
                    user['username'] = new_username
                
                # Verificar se novo email já existe
                if new_email and new_email != user['email']:
                    if self.user_exists(email=new_email):
                        return False, "Email já existe"
                    user['email'] = new_email
                
                # Validar tipo
                if new_tipo:
                    if new_tipo not in ['cliente', 'gerente']:
                        return False, "Tipo deve ser cliente ou gerente"
                    
                    # Validar email para gerente
                    email_to_check = new_email if new_email else user['email']
                    if new_tipo == 'gerente' and not email_to_check.endswith('@adm.com'):
                        return False, "Para ser gerente, o email deve terminar com @adm.com"
                    
                    user['tipo'] = new_tipo
                
                break
        
        if not user_found:
            return False, "Usuário não encontrado"
        
        # Reescrever o arquivo CSV
        with open(self.csv_file_path, 'w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=['username', 'email', 'tipo'])
            writer.writeheader()
            writer.writerows(users)
        
        return True, "Usuário atualizado com sucesso"
    
    def delete_user(self, username):
        """Remove um usuário do CSV"""
        users = self.read_users()
        original_count = len(users)
        
        users = [user for user in users if user['username'] != username]
        
        if len(users) == original_count:
            return False, "Usuário não encontrado"
        
        # Reescrever o arquivo CSV
        with open(self.csv_file_path, 'w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=['username', 'email', 'tipo'])
            writer.writeheader()
            writer.writerows(users)
        
        return True, "Usuário removido com sucesso"


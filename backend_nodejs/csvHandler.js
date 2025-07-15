const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

class CSVHandler {
    constructor() {
        this.csvPath = path.join(__dirname, 'users.csv');
        this.initializeCSV();
    }

    initializeCSV() {
        // Verifica se o arquivo CSV existe, se não, cria com cabeçalho
        if (!fs.existsSync(this.csvPath)) {
            const csvWriter = createCsvWriter({
                path: this.csvPath,
                header: [
                    { id: 'username', title: 'username' },
                    { id: 'email', title: 'email' },
                    { id: 'tipo', title: 'tipo' }
                ]
            });
            csvWriter.writeRecords([]).then(() => {
                console.log('Arquivo CSV criado com sucesso');
            });
        }
    }

    async readUsers() {
        return new Promise((resolve, reject) => {
            const users = [];
            
            if (!fs.existsSync(this.csvPath)) {
                resolve([]);
                return;
            }

            fs.createReadStream(this.csvPath)
                .pipe(csv())
                .on('data', (data) => {
                    // Verificar se a linha não está vazia e tem dados válidos
                    if (data.username && data.username.trim() !== '' && 
                        data.email && data.email.trim() !== '' && 
                        data.tipo && data.tipo.trim() !== '') {
                        users.push({
                            username: data.username.trim(),
                            email: data.email.trim(),
                            tipo: data.tipo.trim()
                        });
                    }
                })
                .on('end', () => {
                    resolve(users);
                })
                .on('error', (error) => {
                    console.error('Erro ao ler CSV:', error);
                    reject(error);
                });
        });
    }

    async writeUsers(users) {
        const csvWriter = createCsvWriter({
            path: this.csvPath,
            header: [
                { id: 'username', title: 'username' },
                { id: 'email', title: 'email' },
                { id: 'tipo', title: 'tipo' }
            ]
        });

        try {
            await csvWriter.writeRecords(users);
            console.log('CSV atualizado com sucesso');
            return true;
        } catch (error) {
            console.error('Erro ao escrever no CSV:', error);
            return false;
        }
    }

    async addUser(username, email, tipo) {
        try {
            const users = await this.readUsers();
            
            // Verificar se o usuário já existe
            const existingUser = users.find(user => 
                user.username === username || user.email === email
            );
            
            if (existingUser) {
                return { success: false, error: 'Usuário já existe' };
            }

            // Adicionar novo usuário
            users.push({ username, email, tipo });
            const success = await this.writeUsers(users);
            
            if (success) {
                return { success: true, user: { username, email, tipo } };
            } else {
                return { success: false, error: 'Erro ao salvar usuário' };
            }
        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
            return { success: false, error: 'Erro interno do servidor' };
        }
    }

    async findUser(username, email) {
        try {
            const users = await this.readUsers();
            const user = users.find(user => 
                user.username === username && user.email === email
            );
            return user || null;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    }

    async updateUser(username, newData) {
        try {
            const users = await this.readUsers();
            const userIndex = users.findIndex(user => user.username === username);
            
            if (userIndex === -1) {
                return { success: false, error: 'Usuário não encontrado' };
            }

            // Atualizar dados do usuário
            users[userIndex] = { ...users[userIndex], ...newData };
            const success = await this.writeUsers(users);
            
            if (success) {
                return { success: true, user: users[userIndex] };
            } else {
                return { success: false, error: 'Erro ao atualizar usuário' };
            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return { success: false, error: 'Erro interno do servidor' };
        }
    }

    async deleteUser(username) {
        try {
            const users = await this.readUsers();
            const filteredUsers = users.filter(user => user.username !== username);
            
            if (users.length === filteredUsers.length) {
                return { success: false, error: 'Usuário não encontrado' };
            }

            const success = await this.writeUsers(filteredUsers);
            
            if (success) {
                return { success: true, message: 'Usuário removido com sucesso' };
            } else {
                return { success: false, error: 'Erro ao remover usuário' };
            }
        } catch (error) {
            console.error('Erro ao remover usuário:', error);
            return { success: false, error: 'Erro interno do servidor' };
        }
    }
}

module.exports = CSVHandler;


FROM node:latest

# Instalação das dependências necessárias, incluindo libnss3
RUN apt-get update && \
    apt-get install -y libnss3 && \
    rm -rf /var/lib/apt/lists/*

# Copiar o código da aplicação para o contêiner
WORKDIR /usr/src/app
COPY . .

# Instalar as dependências do Node.js
RUN npm install

# Comando de inicialização da aplicação
CMD ["npm", "start"]

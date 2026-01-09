# Como Configurar MongoDB

## Opção 1: MongoDB Atlas (Cloud) - Recomendado

1. Acesse https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um cluster
4. Copie a string de conexão
5. Atualize o arquivo `.env` no backend:

```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/acapulco
```

## Opção 2: MongoDB Local (Windows)

1. Baixe MongoDB Community de https://www.mongodb.com/try/download/community
2. Instale normalmente
3. Após instalar, execute:

```
mongod
```

4. Em outro terminal, execute o seed:

```
cd backend
node scripts/seedCryptos.js
```

## Opção 3: MongoDB via Docker

```
docker run -d -p 27017:27017 --name mongodb mongo:latest
node scripts/seedCryptos.js
```

## Seed de Dados

Após configurar MongoDB, crie as criptos com:

```
curl -X POST http://localhost:5000/api/cryptos/seed/init
```

Ou acesse no navegador:
`http://localhost:5000/api/cryptos/seed/init`

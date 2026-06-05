# 🎯 Painel Admin - Gerenciamento de Criptmoedas

## Como Acessar

### 1. Credenciais de Admin
```
Email: admin@example.com
Senha: admin123
```

### 2. Passos para Acessar o Painel

1. **Faça login** na aplicação com as credenciais acima
2. **Navegue para** `/admin` (Painel Administrativo)
3. **Clique em** "Gerenciar Criptomoedas"
4. Você será redirecionado para `/admin/cryptos`

### 3. Funcionalidades Disponíveis

#### ✅ Criar Nova Criptmoeda
- Clique no botão **"Nova Cripto"**
- Preencha os campos:
  - **Nome**: Ex. Bitcoin
  - **Símbolo**: Ex. BTC
  - **Período (dias)**: Ex. 30
  - **Rendimento (%)**: Ex. 15.5
- Clique em **"Salvar"**

#### ✏️ Editar Criptmoeda
- Na tabela, clique no botão **"Editar"** na linha da cripto
- Modifique os dados desejados
- Clique em **"Salvar"**

#### ❌ Deletar Criptmoeda
- Na tabela, clique no botão **"Deletar"** na linha da cripto
- Confirme a exclusão na janela de confirmação

## 📊 Estrutura da Criptmoeda

Cada criptmoeda tem os seguintes campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| Nome | Text | Nome da criptmoeda (ex: Bitcoin) |
| Símbolo | Text | Símbolo em maiúsculas (ex: BTC) |
| Período | Number | Duração do investimento em dias |
| Rendimento | Number | Percentual de retorno (ex: 15.5) |

## 🔐 Segurança

- Apenas usuários com role de **Admin** podem acessar este painel
- Todas as operações são autenticadas com JWT Token
- As mudanças são armazenadas imediatamente no banco de dados

## 💡 Exemplos de Criptmoedas

Aqui estão alguns exemplos que você pode criar:

```
1. Bitcoin Plus
   - Símbolo: BTCP
   - Período: 30 dias
   - Rendimento: 15%

2. Ethereum Premium
   - Símbolo: ETHP
   - Período: 60 dias
   - Rendimento: 20%

3. Safe Coin
   - Símbolo: SAFE
   - Período: 90 dias
   - Rendimento: 25%

4. Gold Crypto
   - Símbolo: GOLD
   - Período: 180 dias
   - Rendimento: 35%
```

## 🚀 Próximos Passos

Após criar as criptmoedas, os usuários poderão:
- Ver a lista de criptmoedas disponíveis no dashboard
- Investir em qualquer uma delas
- Acompanhar seus investimentos
- Obter rendimentos baseados no percentual configurado

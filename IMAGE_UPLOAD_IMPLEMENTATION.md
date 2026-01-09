# Image Upload Implementation - Acapulco Project

## Overview
Implementada funcionalidade completa de upload de imagens para criptmoedas com exibição em todas as páginas relevantes.

## Changes Made

### Backend

#### 1. **Upload Middleware** (`backend/middleware/upload.js`)
- ✅ Já estava configurado
- Suporta arquivos JPG, PNG, GIF
- Limite máximo de 5MB
- Cria pasta `/uploads` automaticamente

#### 2. **Routes** (`backend/routes/cryptoRoutes.js`)
- Adicionado `upload.single('image')` na rota POST (CREATE)
- Adicionado `upload.single('image')` na rota PUT (UPDATE)
- Ambas agora suportam upload de arquivo

#### 3. **Controller** (`backend/controllers/cryptoController.js`)
- **createCrypto()**: Atualizado para processar `req.file`
  - Extrai nome do arquivo: `/uploads/{filename}`
  - Aceita campo `description`
  - Valida planos como array
  
- **updateCrypto()**: Novo tratamento para imagem
  - Processa `req.file` se fornecido
  - Faz parse de `plans` se vindo como string (FormData)
  - Mantém imagem anterior se não enviar nova

#### 4. **Express Server** (`backend/index.js`)
- ✅ Já estava configurado
- `app.use('/uploads', express.static())` servindo arquivos estáticos

### Frontend

#### 1. **CryptoAdminPage** (`frontend/src/pages/CryptoAdminPage.js`)
**Adições:**
- Estado expandido para suportar imagem:
  ```javascript
  image: null,
  imagePreview: null,
  description: ''
  ```
- Nova função `handleImageChange()`: 
  - Lê arquivo com FileReader
  - Cria preview em base64
  - Armazena ambos state e file

- Campos do Dialog:
  - **Descrição**: TextField multiline para descrição da cripto
  - **Imagem**: 
    - File input (aceita apenas imagens)
    - Preview do arquivo selecionado
    - Botão "Selecionar Imagem"

- **handleSave() atualizado**:
  - Cria FormData ao invés de objeto JSON
  - Adiciona arquivo à FormData se selecionado
  - Faz parse de plans como JSON string em FormData

#### 2. **apiService** (`frontend/src/services/apiService.js`)
**Funções atualizadas:**
- `createCrypto()`: Detecção automática de FormData
  - Define header `Content-Type: multipart/form-data` quando necessário
  
- `updateCrypto()`: Mesmo tratamento que create
  - Suporta tanto JSON quanto FormData

#### 3. **CryptoDetailPage** (`frontend/src/pages/CryptoDetailPage.js`)
**Exibição de imagem:**
- Se `crypto.image` existe: Exibe imagem em tamanho 150x150px
- Fallback: Ícone de Bitcoin com gradiente
- Imagem é clicável e responsiva

#### 4. **CryptoListPage** (`frontend/src/pages/CryptoListPage.js`)
**Exibição de imagem nos cards:**
- Seção nova de 120px de altura no topo de cada card
- Se `crypto.image` existe: Exibe imagem com `objectFit: cover`
- Fallback: Ícone com gradiente semi-transparente
- Mantém responsividade do carrossel Swiper

## Data Flow

### Create/Upload Flow
1. Admin seleciona arquivo no formulário
2. `handleImageChange()` processa e cria preview
3. Admin clica "Salvar"
4. `handleSave()` cria FormData com:
   - name, symbol, price, description
   - plans (JSON string)
   - image (File object)
5. Axios POST para `/api/cryptos/` com multipart
6. Multer intercepta, salva em `/uploads/{hash}.jpg`
7. Controller recebe `req.file`, extrai path
8. Crypto documento salva com `image: '/uploads/...'`
9. Frontend redireciona, recarrega lista

### Display Flow
1. GET `/api/cryptos/:id` retorna documento com campo `image`
2. CryptoDetailPage: 
   - Se `image` exists → renderiza `<Box component="img" src={image} />`
   - Else → renderiza ícone de fallback
3. CryptoListPage:
   - Mesmo padrão em cada card do carrossel
   - Preview do arquivo durante edição (base64)

## File Storage
```
backend/
  uploads/
    1234567890-987654321.jpg
    1234567891-987654322.png
    etc...
```
- Nomes únicos com timestamp + random
- Servidos em `http://localhost:5000/uploads/filename`

## Testing Checklist

- [ ] Admin cria cripto com imagem
  - [ ] Arquivo salvo em `/uploads/`
  - [ ] Documento contém campo `image` com path correto
  
- [ ] Admin edita cripto (com/sem nova imagem)
  - [ ] Sem nova imagem: mantém imagem anterior
  - [ ] Com nova imagem: substitui a anterior
  
- [ ] CryptoDetailPage exibe imagem
  - [ ] Imagem carrega corretamente
  - [ ] Fallback funciona se sem imagem
  - [ ] Responsividade OK
  
- [ ] CryptoListPage exibe imagem nos cards
  - [ ] Todas as imagens carregam no carrossel
  - [ ] Fallback para cards sem imagem
  - [ ] Scroll/navegação do carrossel OK

- [ ] Upload errors
  - [ ] Arquivo muito grande (>5MB): erro capturado
  - [ ] Tipo de arquivo inválido: erro capturado
  - [ ] Sem espaço em disco: erro tratado

## Browser Compatibility
- Suporta FileReader (IE10+, todos modernos)
- Suporta FormData (IE10+, todos modernos)
- Multipart/form-data: padrão HTTP, suportado universalmente

## Performance Notes
- Imagens são servidas como arquivos estáticos (rápido)
- Preview em base64 é feito apenas durante edição (memory efficient)
- Multer limita a 5MB por arquivo para evitar sobrecarga

## Future Enhancements
- [ ] Validação de dimensões de imagem (min 200x200)
- [ ] Compressão automática antes de salvar
- [ ] Armazenamento em S3/cloud ao invés de local
- [ ] Remoção de imagens antigas quando editado
- [ ] Crop/resize UI para usuário fazer upload de imagem perfeita
- [ ] Watermark ou processamento de imagem adicional

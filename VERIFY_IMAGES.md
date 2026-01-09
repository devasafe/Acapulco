# 🔧 Como Verificar Imagens no Banco

## Opção 1: Verificar via cURL (Mais rápido)

Abra PowerShell e execute:

```powershell
# Teste se a API está retornando imagens
Invoke-RestMethod -Uri "http://localhost:5000/api/cryptos" -Method Get | ConvertTo-Json | Select-String "image" -Context 2

# Ou para ver tudo:
Invoke-RestMethod -Uri "http://localhost:5000/api/cryptos" -Method Get | ConvertTo-Json | Out-Host
```

## Opção 2: Verificar via Node Script

Na pasta backend, execute:

```powershell
cd D:\PROJETOS\Acapulco\backend
node check-cryptos.js
```

## Opção 3: Inspecionar no Browser

1. Abra DevTools (F12)
2. Console
3. Copie e cole:

```javascript
fetch('http://localhost:5000/api/cryptos')
  .then(r => r.json())
  .then(cryptos => {
    console.log('Total de criptomoredas:', cryptos.length);
    cryptos.forEach((c, i) => {
      console.log(`${i+1}. ${c.name}: image = "${c.image || 'VAZIO'}"`);
    });
  })
  .catch(e => console.error('Erro:', e));
```

## Opção 4: MongoDB Compass

Se tiver instalado:
1. Abra MongoDB Compass
2. Conecte em: mongodb://localhost:27017
3. Selecione database: acapulco
4. Selecione collection: cryptos
5. Procure por qualquer documento
6. Verifique se tem campo "image"

## O que Procurar

### Se `image` está vazio/null em TODOS:
**Problema**: Cryptos antigas criadas ANTES de implementar imagem

**Solução**: 
1. Vá em Admin → Gerenciar Criptmoedas
2. Clique Editar em qualquer crypto
3. Clique "Selecionar Imagem" e escolha um arquivo
4. Clique Salvar
5. A imagem agora deve aparecer

### Se `image` tem valor em ALGUNS:
**Problema**: Provavelmente é um problema de URL ou path

**Solução**:
1. Verificar se arquivo existe:
   ```powershell
   # Se image = "/uploads/1767939441600-595466043.jpg"
   Test-Path "D:\PROJETOS\Acapulco\backend\uploads\1767939441600-595466043.jpg"
   ```
2. Se existe, testar URL no browser:
   - Abra: http://localhost:5000/uploads/1767939441600-595466043.jpg
   - Se carrega: É problema no frontend
   - Se erro 404: Arquivo não existe

### Se `image` tem valor e arquivo existe:
**Problema**: Provavelmente caminho começando errado

**Exemplos de PATHS ERRADOS**:
- `"uploads/1767939441600-595466043.jpg"` (falta `/`)
- `"1767939441600-595466043.jpg"` (falta `/uploads/`)
- `"http://...../uploads/..."` (absoluto, não relativo)

**Solução**: Editar no MongoDB Compass e corrigir

---

**Qual vai usar?** A mais fácil é a **Opção 3 (Browser Console)** se o servidor está rodando.

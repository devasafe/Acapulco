# 🧪 Teste Step-by-Step - Image Display Issue

## Cenário
- Você criou criptomoredas com planos ✓
- Você subiu imagens ✓
- Mas as imagens não aparecem na tela ❌

## Debug Passo 1: Verificar no Console do Browser

1. **Abra DevTools** (F12 na página)
2. **Vá para Console**
3. **Cole isto:**

```javascript
fetch('http://localhost:5000/api/cryptos')
  .then(r => r.json())
  .then(cryptos => {
    console.log('=== CRYPTOS NO BANCO ===');
    cryptos.slice(0, 3).forEach(c => {
      console.log(`
        Nome: ${c.name}
        Image field exists: ${c.hasOwnProperty('image')}
        Image value: ${c.image}
        Image is truthy: ${!!c.image}
      `);
    });
  });
```

4. **Pressione Enter**
5. **Veja o output**

## Debug Passo 2: Verificar Tags HTML

1. **Abra DevTools** (F12)
2. **Vá para Elements/Inspector**
3. **Procure por `<img>` tags:**
   - Clique com botão direito na página
   - Selecione "Inspecionar" (Inspect)
   - Procure por elementos `<img>`
4. **Procure especificamente:**
   - `<Box component="img" src="/uploads/..."`
   - Ou `<img src="/uploads/..."`

Se encontrou `<img>` com `src` apontando para `/uploads/`:

### Teste a URL
1. **No console do browser:**
```javascript
// Se encontrou <img src="/uploads/1767939441600-595466043.jpg">
fetch('http://localhost:5000/uploads/1767939441600-595466043.jpg')
  .then(r => {
    console.log('Status:', r.status);
    if (r.ok) console.log('✓ Arquivo existe!');
    else console.log('❌ Arquivo 404');
    return r.blob();
  })
  .then(blob => console.log('Arquivo tamanho:', blob.size, 'bytes'))
  .catch(e => console.error('Erro:', e));
```

2. **Se retorna 200 e tamanho > 0:** Arquivo existe e é acessível
3. **Se retorna 404:** Arquivo não existe no servidor

## Debug Passo 3: Forçar Novo Teste

Se tudo acima falhar, vamos limpar e testar do zero:

### 1. Crie uma cripto NOVA com imagem:

```
Admin Dashboard 
  → Gerenciar Criptmoedas 
    → Clique "Nova Cripto"
      → Preencha todos os campos:
         • Nome: TestCoin123
         • Símbolo: TST
         • Preço: 50.00
         • Descrição: Test
         • Planos: 30d / 15%
         → Clique "Selecionar Imagem"
         → Escolha uma imagem do seu PC
         → VEJA A PREVIEW DA IMAGEM no dialog
         → Clique "Salvar"
```

### 2. Imediatamente após salvar:

**No console do browser, cole:**
```javascript
fetch('http://localhost:5000/api/cryptos?name=TestCoin123')
  .then(r => r.json())
  .then(cryptos => {
    const testCoin = cryptos.find(c => c.name === 'TestCoin123');
    if (testCoin) {
      console.log('TestCoin encontrada:');
      console.log('Image field:', testCoin.image);
    } else {
      console.log('TestCoin não encontrada');
      console.log('Disponíveis:', cryptos.map(c => c.name));
    }
  });
```

### 3. Abra a página de Criptomoredas:

**Vá em: Home → Criptomoredas (ou botão equivalente)**

1. **Procure por TestCoin123 no carrossel**
2. **Abra DevTools → Console**
3. **Cole:**
```javascript
// Procure por TestCoin nos logs
// Você deve ver:
// {name: "TestCoin123", image: "/uploads/1767...", hasImage: true}
```

## Possível Problema Encontrado: Paths não começando com /

Se você vê imagem vazia mas no console tem:
```javascript
image: "uploads/1767939441600-595466043.jpg"  // Falta /
// OU
image: "1767939441600-595466043.jpg"  // Falta /uploads/
```

**SOLUÇÃO:** Abra MongoDB Compass e corrija manual:

1. Abra MongoDB Compass
2. Conecte em: `mongodb://localhost:27017`
3. Database: `acapulco`
4. Collection: `cryptos`
5. Procure por um documento com `image` field vazio/errado
6. Clique para editar
7. Mude para: `/uploads/[filename-correto].jpg`
8. Save

OU use este comando no MongoDB:

```javascript
// Adicionar / antes se falta
db.cryptos.updateMany(
  { image: { $regex: "^(?!\/)" } },  // que não começa com /
  [{ $set: { image: { $concat: ["/", "$image"] } } }]
);
```

## Se Tudo Falhó

Opção nuclear - resetar tudo:

```powershell
# 1. Parar backend (Ctrl+C)

# 2. Deletar e recrear pasta uploads
Remove-Item -Recurse -Force D:\PROJETOS\Acapulco\backend\uploads
New-Item -ItemType Directory -Path D:\PROJETOS\Acapulco\backend\uploads

# 3. Limpar database (opcional, via MongoDB Compass ou shell)
# db.cryptos.deleteMany({})

# 4. Reiniciar backend
cd D:\PROJETOS\Acapulco\backend
npm start

# 5. Limpar cache do browser
# Ctrl+Shift+Delete (Chrome) e limpar tudo

# 6. Criar novo crypto com imagem
# Admin → Gerenciar Criptmoedas → Nova Cripto → Selecionar Imagem → Salvar
```

## Expected Output

Se tudo funciona, você deve ver no console:

```javascript
=== CRYPTOS NO BANCO ===
Nome: TestCoin123
Image field exists: true          ✓
Image value: /uploads/1767...jpg ✓
Image is truthy: true            ✓
```

E quando você inspeciona a página:
```html
<Box component="img" 
     src="/uploads/1767939441600-595466043.jpg"
     alt="TestCoin123"
     style={{...}}
/>
```

E você vê a imagem renderizada na tela ✓

---

**Execute estes testes e me diga o que encontrou no console!**

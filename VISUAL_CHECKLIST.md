# ✅ CHECKLIST - Verificar Imagens

## Fase 1: Carregar Código Novo

- [ ] Terminal 1: Kill backend (Ctrl+C)
- [ ] Terminal 2: Kill frontend (Ctrl+C)
- [ ] Terminal 1: `cd backend && npm start`
  - Espera: ✓ MongoDB connected
  - Espera: ✓ Server running on port 5000
- [ ] Terminal 2: `cd frontend && npm start`
  - Espera: ✓ Compiled successfully!
- [ ] Browser atualiza automaticamente (ou Ctrl+F5)

---

## Fase 2: Verificar DevTools

- [ ] F12 para abrir DevTools
- [ ] Tab: **Console**
- [ ] Procure por logs tipo:
  ```
  Cryptos loaded: [...]
  ```
- [ ] Se não vir: Recarregue página (Ctrl+F5)

---

## Fase 3: Verificar API Response

No console, copie e cola:

```javascript
fetch('http://localhost:5000/api/cryptos')
  .then(r => r.json())
  .then(cryptos => {
    console.log('=== CRYPTOS NO BANCO ===');
    cryptos.slice(0, 3).forEach(c => {
      console.log(`${c.name}: image = ${c.image || 'VAZIO'}`);
    });
  });
```

- [ ] Execute
- [ ] Veja resultado

### Possíveis Resultados:

#### ✅ BOM:
```
Bitcoin: image = /uploads/1767939441600-595466043.jpg
Ethereum: image = /uploads/1767869705687-894887989.jpg
```
**Próximo passo:** Ir para Fase 4

#### ⚠️ MÉDIO:
```
Bitcoin: image = uploads/1767939441600-595466043.jpg  (falta /)
Ethereum: image =                                      (vazio)
```
**Próximo passo:** Ver Fase 5 (Fix Database)

#### ❌ RUIM:
```
Bitcoin: image = VAZIO
Ethereum: image = VAZIO
```
**Próximo passo:** Ver Fase 6 (Create New Crypto)

---

## Fase 4: Visual Check (Se API OK)

- [ ] Vá em: **Criptomoredas** (botão Home → Criptomoredas)
- [ ] Veja o **carrossel** de cards
- [ ] Procure por:
  - ✅ Imagens nos cards, OU
  - ✅ Ícone Bitcoin (fallback)
- [ ] **Se vir imagens:** Funciona! 🎉 → Ir para Fase 7
- [ ] **Se vir só ícones:** Pode ser database issue → Ir para Fase 5

---

## Fase 5: Fix Database (Se Paths Errados)

### Opção A: Editar e Re-upload (Simples)

- [ ] Vá em: **Admin → Gerenciar Criptomoredas**
- [ ] Clique **Editar** em qualquer cripto
- [ ] Clique **Selecionar Imagem**
- [ ] Escolha uma imagem (PNG ou JPG)
- [ ] Veja a **preview** aparecer
- [ ] Clique **Salvar**
- [ ] Volte para **Criptomoredas**
- [ ] Procure pela cripto editada
- [ ] Procure pela **imagem no card**
- [ ] ✅ Se aparecer: Fixado!
- [ ] ❌ Se não aparecer: Ir para Fase 5B

### Opção B: Criar Nova Cripto com Imagem (Nuclear)

- [ ] Vá em: **Admin → Gerenciar Criptomoredas**
- [ ] Clique **Nova Cripto**
- [ ] Preencha:
  - Nome: `TestCoin99`
  - Símbolo: `TST`
  - Preço: `100.00`
  - Descrição: `Test`
  - Planos: `30d / 15%`
- [ ] Clique **Selecionar Imagem**
- [ ] Escolha imagem
- [ ] Veja preview
- [ ] Clique **Salvar**
- [ ] Vá para **Criptomoredas**
- [ ] Procure **TestCoin99** no carrossel
- [ ] ✅ Se vê imagem: Funciona!
- [ ] ❌ Se só icon: Ir para Fase 5C

### Opção C: Reset Total (Se nada funciona)

```powershell
# Parar tudo
# Ctrl+C em ambos os terminals

# Deletar uploads
Remove-Item -Recurse -Force D:\PROJETOS\Acapulco\backend\uploads
New-Item -ItemType Directory -Path D:\PROJETOS\Acapulco\backend\uploads

# Reiniciar
cd D:\PROJETOS\Acapulco\backend
npm start

# Outro terminal:
cd D:\PROJETOS\Acapulco\frontend
npm start

# Browser: Ctrl+Shift+Delete (limpar cache)
# Navegar para http://localhost:3000

# Criar novo crypto com imagem
# Admin → Gerenciar Criptomoredas → Nova Cripto
# Fill all + Select Image + Save

# Verificar se funciona
```

---

## Fase 6: Teste Completo (Se Funciona)

- [ ] Abra página de **Criptomoredas**
- [ ] Veja:
  - ✅ Cards com imagens (alguns/todos)
  - ✅ Cards com icons (fallback)
  - ✅ Carrossel navegando OK
  - ✅ Sem erros na console
  
- [ ] Clique em um **card com imagem**
- [ ] Verifique:
  - ✅ Imagem grande no topo
  - ✅ Nome/Símbolo abaixo
  - ✅ Descrição
  - ✅ Planos
  - ✅ Botão Investir
  
- [ ] Clique em um **card com icon**
- [ ] Verifique:
  - ✅ Icon Bitcoin no topo
  - ✅ Resto igual

- [ ] DevTools Console:
  - ✅ Nenhuma mensagem vermelha de erro
  - ✅ Apenas info logs

---

## Fase 7: Final Validation

- [ ] Imagens aparecem em: **Carousel cards** ✓
- [ ] Imagens aparecem em: **Detail page** ✓
- [ ] Fallback icons funcionam ✓
- [ ] Sem erros no console ✓
- [ ] Novo upload funciona ✓
- [ ] Edit + re-upload funciona ✓

**Se tudo OK:** 🎉 **SUCESSO!**

---

## Troubleshooting Quick Reference

| Sintoma | Solução |
|---------|---------|
| Tudo vazio (sem imagem, sem icon) | Reload (Ctrl+F5) ou npm start |
| API response vazio | Verificar MongoDB e backend |
| Imagem 404 | Arquivo não em `/uploads/` |
| Path sem `/uploads/` | Editar crypto e re-upload |
| Só icon, sem imagem | Database vazio, fazer upload |
| Console error | Ver mensagem e seguir DEBUG_STEP_BY_STEP.md |
| Tudo funciona | Parabéns! 🎉 |

---

## Documentação Referência

- 📖 Entender o problema: `DEBUG_IMAGE_NOT_SHOWING.md`
- 🔍 Diagnóstico detalhado: `DEBUG_STEP_BY_STEP.md`
- ✅ Solução final: `FINAL_SOLUTION.md`
- 📋 Resumo técnico: `COMPREHENSIVE_SUMMARY.md`
- ⚡ Super simples: `JUST_DO_THIS.md`

---

## Quando Parar

✅ Pare quando:
- Imagens aparecerem em todos os cards com imagem
- Fallback icon aparecer em cards sem imagem
- Nenhum erro no console
- Novo upload funciona

❌ Não pare se:
- Vê erros vermelhos no console
- Imagens não carregam
- API retorna status 404

---

**Status: Pronto para Testar! 🚀**

Execute este checklist e me avise o resultado!

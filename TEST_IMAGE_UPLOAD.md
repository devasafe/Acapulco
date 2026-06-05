# Quick Test Guide - Image Upload Feature

## Prerequisites
- Backend rodando em `http://localhost:5000`
- Frontend rodando em `http://localhost:3000`
- Admin user logged in

## Test Steps

### 1. Create a Crypto with Image
1. Navigate to Admin Dashboard → Gerenciar Criptmoedas
2. Click "Nova Cripto" button
3. Fill in:
   - **Nome**: Bitcoin Pro
   - **Símbolo**: BTC-P
   - **Preço**: 150.50
   - **Descrição**: Leading cryptocurrency with latest updates
   - **Planos**: Add 30d/15%, 90d/22%
   - **Imagem**: Click "Selecionar Imagem" → select a JPG/PNG file
4. You should see a preview of the image
5. Click "Salvar"
6. Verify image appears in table list

### 2. View in Crypto Detail Page
1. Go to "Criptmoedas" page (public)
2. Click on the crypto card in the carousel
3. Image should display at the top of the card
4. If no image, should show Bitcoin icon instead

### 3. Verify in List/Carousel
1. Go to "Criptmoedas" page
2. Image should appear in each card at top
3. Scroll through carousel with image cards
4. Cards without image should show icon

### 4. Edit Crypto (Update Image)
1. Go to Admin Dashboard → Gerenciar Criptmoedas
2. Click "Editar" on a crypto
3. You'll see current image in preview
4. Click "Selecionar Imagem" to change it
5. Click "Salvar"
6. Verify new image is used everywhere

### 5. Test File Validation
Try these to verify validation:
- File >5MB: Should get error "Arquivo muito grande"
- File type (PDF, TXT, etc): Should get error "Apenas imagens são permitidas"
- Cancel selection: Should keep current image

## Expected Results

✓ Images upload successfully to `/uploads/` folder
✓ Image path saved as `/uploads/[timestamp]-[random].jpg`
✓ Image displays in:
  - Admin page table (preview in edit dialog)
  - Crypto detail page (top of card)
  - Crypto list page (carousel cards)
✓ File validation works (size, type)
✓ Edit without new image keeps old image
✓ Edit with new image replaces old one
✓ Performance is good (static file serving)

## Debug Tips

### Check if image exists:
```bash
# List uploaded files
ls -la backend/uploads/
```

### Check database:
```bash
# MongoDB - verify crypto has image field
db.cryptos.findOne({ name: "Bitcoin Pro" })
# Should show: image: "/uploads/1234567890-123456.jpg"
```

### Check API response:
Open browser DevTools → Network → GET `/api/cryptos/:id`
Response should include: `"image": "/uploads/filename.jpg"`

### Common Issues

**Problem**: Image doesn't display
- Check file exists in `/uploads/` folder
- Check image path in database (should start with `/uploads/`)
- Check browser console for 404 errors
- Verify Express static middleware is working

**Problem**: Upload fails silently
- Check browser console for errors
- Check network tab for failed requests
- Verify file is actually an image (not corrupted)
- Check server logs for multer errors

**Problem**: Only icon shows, no image
- Image field might be null in database
- Check Admin page to verify image was saved
- Try uploading image again in edit dialog

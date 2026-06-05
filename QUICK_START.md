# 🖼️ IMAGE UPLOAD FEATURE - QUICK START

## What Was Added?

### For Admins
**Upload crypto images:**
```
Gerenciar Criptmoedas 
  → Nova Cripto / Editar 
    → Click "Selecionar Imagem"
      → Choose JPG/PNG/GIF
        → See preview
          → Click "Salvar"
```

### For Users  
**See crypto images:**
```
Criptmoedas (browse)
  → See image in each card
    ↓
    Click card
      → See large image at top
        ↓
        See details + invest
```

---

## 📁 What Changed?

### Backend (2 files, simple changes)
1. **routes/cryptoRoutes.js**
   - Added: `upload.single('image')` to POST and PUT routes
   
2. **controllers/cryptoController.js**
   - Modified: `updateCrypto()` to handle image files

### Frontend (4 files, UI updates)
1. **pages/CryptoAdminPage.js**
   - Added: File input + image preview in form
   
2. **services/apiService.js**
   - Modified: Support FormData for multipart uploads
   
3. **pages/CryptoDetailPage.js**
   - Added: Display image at top of card
   
4. **pages/CryptoListPage.js**
   - Added: Display image in carousel cards

---

## 🎯 Files You Can Check

### To Understand the Feature:
```
1. Read: IMPLEMENTATION_COMPLETE.md ← Full details
2. Test: TEST_IMAGE_UPLOAD.md ← How to test
3. See:  CHANGES_SUMMARY.md ← Visual summary
```

### To Debug:
```
Backend uploads folder:
  backend/uploads/
  
Browser DevTools:
  Network tab → watch POST/PUT requests
  Console → see any errors
  
Database:
  Each crypto now has "image" field with path
```

---

## 🚀 Getting Started

### Step 1: Start Services
```bash
# Terminal 1 - Backend
cd backend
npm start
# Should see: Server running on port 5000

# Terminal 2 - Frontend  
cd frontend
npm start
# Should see: localhost:3000 in browser
```

### Step 2: Test Upload
1. Login as admin
2. Go to Dashboard → Gerenciar Criptmoedas
3. Click "Nova Cripto"
4. Fill in all fields
5. Click "Selecionar Imagem"
6. Choose a PNG/JPG from your computer
7. See preview appear
8. Click "Salvar"

### Step 3: Verify It Works
1. Go to "Criptmoedas" page
2. Should see image in card
3. Click card → Should see large image

---

## 🎨 Visual Layout

### Admin Form
```
┌─────────────────────────────────┐
│ Dialog: Nova Cripto             │
├─────────────────────────────────┤
│ Nome: [Bitcoin         ]        │
│ Símbolo: [BTC    ]              │
│ Preço: [150.50   ]              │
│ Descrição: [text area]          │
│                                 │
│ ┌─────────────────────────────┐ │
│ │   [Image Preview Here]      │ │ ← NEW
│ │   or "Nenhuma imagem"       │ │
│ ├─────────────────────────────┤ │
│ │  Selecionar Imagem  [→]     │ │ ← NEW
│ └─────────────────────────────┘ │
│                                 │
│ Plans section...                │
│                                 │
│ [Cancelar] [Salvar]             │
└─────────────────────────────────┘
```

### Detail Page
```
┌──────────────────────────────┐
│  [← Voltar]                  │
│                              │
│   ┌──────────────────────┐   │
│   │                      │   │
│   │  [Image here]        │   │ ← NEW
│   │  (or Bitcoin icon)   │   │
│   │                      │   │
│   ├──────────────────────┤   │
│   │ Bitcoin              │   │
│   │ BTC                  │   │
│   │ Bitcoin Pro is...    │   │
│   └──────────────────────┘   │
│                              │
│   [Chart]                    │
│   [Plan Selector]            │
│   [Summary]                  │
│   [Investir Agora]           │
└──────────────────────────────┘
```

### List Page (Carousel)
```
  [◄] Criptmoedas Disponíveis [►]

┌─────────────────┬──────────────────┬──────────────────┐
│                 │                  │                  │
│  ┌───────────┐  │ ┌────────────┐   │ ┌────────────┐   │
│  │ Image BTC │  │ │ Image ETH  │   │ │ Image ADA  │   │
│  │ 120px     │  │ │ 120px      │   │ │ 120px      │   │
│  └───────────┘  │ └────────────┘   │ └────────────┘   │
│                 │                  │                  │
│ Bitcoin (BTC)   │ Ethereum (ETH)   │ Cardano (ADA)    │
│ R$ 150.50       │ R$ 120.00        │ R$ 95.00         │
│                 │                  │                  │
│ 30d/15%         │ 30d/12%          │ 30d/10%          │
│ 90d/22%         │ 90d/18%          │ 90d/15%          │
│                 │                  │                  │
│ [Investir]      │ [Investir]       │ [Investir]       │
└─────────────────┴──────────────────┴──────────────────┘
```

---

## 💾 Database Changes

Before:
```json
{
  "_id": "...",
  "name": "Bitcoin",
  "symbol": "BTC",
  "price": 150,
  "plans": [...]
}
```

After:
```json
{
  "_id": "...",
  "name": "Bitcoin",
  "symbol": "BTC",
  "price": 150,
  "description": "Bitcoin is...",        ← NEW
  "image": "/uploads/1704067200000.jpg", ← NEW
  "plans": [...]
}
```

---

## ✅ Checklist

- [ ] Backend started (http://localhost:5000)
- [ ] Frontend started (http://localhost:3000)
- [ ] Logged in as admin
- [ ] Created crypto with image
- [ ] Image shows in admin table
- [ ] Image shows in detail page
- [ ] Image shows in list page
- [ ] Edited crypto without changing image (keeps old image)
- [ ] Edited crypto with new image (replaces old image)
- [ ] Tried uploading non-image file (got error)
- [ ] Tried uploading file >5MB (got error)

---

## 🔍 How to Find Your Image

### In the Browser
1. Go to any page showing crypto image
2. Right-click image → "Inspect"
3. Look at `src` attribute
4. Example: `src="/uploads/1704067200000-987654.jpg"`

### On Disk
```
Windows: D:\PROJETOS\Acapulco\backend\uploads\
Mac/Linux: ~/projects/acapulco/backend/uploads/

Should see files like:
- 1704067200000-123456.jpg
- 1704067210000-789012.png
- etc...
```

### In Database
```
MongoDB shell:
db.cryptos.findOne({ name: "Bitcoin" })

Look for:
"image": "/uploads/filename.jpg"
```

---

## ⚡ Common Actions

### Upload New Image
```
Admin Page → Editar → Selecionar Imagem → Pick file → Salvar
```

### Remove Image
```
Currently: Not supported
Future: Can add delete button in edit dialog
```

### Change Image
```
Admin Page → Editar → Selecionar Imagem → Pick new file → Salvar
(Old image still in disk but not referenced)
```

### View Full Size
```
Detail Page → Image appears at 150x150px (max)
Right-click → Open Image in New Tab (full size)
```

---

## 🎓 Technical Details (Optional)

### File Upload Flow
1. Admin selects file in dialog
2. JavaScript reads file with FileReader
3. Shows preview (base64)
4. On save, creates FormData
5. Axios sends as multipart/form-data
6. Multer middleware intercepts
7. Saves file to `/backend/uploads/`
8. Returns filename to controller
9. Controller saves path to MongoDB
10. Frontend fetches and displays

### Image Display Flow
1. API returns crypto with `image` path
2. React renders `<Box component="img" src={image} />`
3. Browser makes request to `/uploads/filename`
4. Express serves static file
5. Image displays in browser

---

## 📞 Help

**It's not working?**
1. Check backend console for errors
2. Check browser console (F12)
3. Check network tab for 404s
4. Verify `/backend/uploads/` folder exists
5. Check file permissions
6. See DEBUG TIPS in TEST_IMAGE_UPLOAD.md

**How do I reset?**
1. Delete all files in `/backend/uploads/`
2. Clear database or reset image fields
3. Restart server
4. Try uploading again

---

## 📚 More Documentation

- **IMPLEMENTATION_COMPLETE.md** - Full technical details
- **TEST_IMAGE_UPLOAD.md** - Detailed testing guide
- **CHANGES_SUMMARY.md** - Visual change summary
- **IMAGE_UPLOAD_IMPLEMENTATION.md** - Implementation notes

---

**Ready? Let's go! 🚀**

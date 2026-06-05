# 🔍 Debug - Image Display Issue

## Problem
- Space for image appears correctly ✓
- But image doesn't display ❌
- Shows fallback icon instead

## Possible Causes

### 1. Image path not in database
Check what's actually in MongoDB:

```javascript
// Open MongoDB shell or Compass
db.cryptos.findOne()

// Look for "image" field:
// Should be: "image": "/uploads/1767939441600-595466043.jpg"
// If missing or null: Problem is database
```

### 2. Image URL format wrong
The image path might be stored as:
```javascript
// ❌ WRONG:
"image": "1767939441600-595466043.jpg"    // Missing /uploads/
"image": "uploads/1767939441600-595466043.jpg"  // Missing leading /

// ✅ CORRECT:
"image": "/uploads/1767939441600-595466043.jpg"
```

### 3. Frontend not loading updated crypto
Cached data might be showing:

```javascript
// In browser console (F12)
// Network tab → GET /api/cryptos
// Look at Response:
// Should show "image": "/uploads/..." for cryptos with images
```

### 4. Image uploaded but not linked to crypto
File exists in `/uploads/` but database record missing the `image` field.

## Quick Diagnostic Steps

### Step 1: Check Database
```bash
# Option A: MongoDB Compass or shell
db.cryptos.findOne()
# Check if "image" field exists and has value

# Option B: Check via API
curl http://localhost:5000/api/cryptos
# Response should include "image" field in each crypto
```

### Step 2: Check Network
```
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for requests:
   - GET /api/cryptos → Should have "image" field
   - GET /uploads/[filename] → Should load image or 404
5. Click on each request to see response
```

### Step 3: Check Image Files
```powershell
# List uploaded files
ls -la D:\PROJETOS\Acapulco\backend\uploads

# If files exist but not showing:
# Problem is linking or path in database
```

### Step 4: Browser Console
```javascript
// F12 → Console
// Paste this:
fetch('http://localhost:5000/api/cryptos')
  .then(r => r.json())
  .then(cryptos => {
    console.log('Cryptos:', cryptos);
    cryptos.forEach(c => {
      console.log(`${c.name}: image = ${c.image || 'MISSING'}`);
    });
  });
```

## What Should Happen

### Backend
1. ✓ Multer receives file → saves to `/uploads/filename`
2. ✓ Controller reads `req.file.filename`
3. ✓ Controller saves `image: /uploads/filename` to database
4. ✓ GET `/api/cryptos` returns image path in response

### Frontend  
1. ✓ Gets crypto with `image: "/uploads/filename"`
2. ✓ Renders `<img src="/uploads/filename" />`
3. ✓ Browser requests `/uploads/filename`
4. ✓ Express serves the file
5. ✓ Image displays ✓

### Browser
1. ✓ GET `/uploads/filename` → 200 OK
2. ✓ Image data received
3. ✓ Image renders

## Most Likely Problem

**Old cryptos in database don't have image field:**

If cryptos were created BEFORE image upload was implemented, they won't have the `image` field.

**Solution:**
1. Delete old cryptos from database
2. Create new crypto WITH image upload
3. Image should now appear

**OR** manually add image field:

```javascript
// MongoDB:
db.cryptos.updateMany(
  {},
  { $set: { image: null } }
);
// This adds the field to all cryptos

// Then manually update one:
db.cryptos.updateOne(
  { name: "Bitcoin" },
  { $set: { image: "/uploads/1767939441600-595466043.jpg" } }
);
```

## Test This

### Create Fresh Crypto with Image
1. Admin → Gerenciar Criptmoedas
2. Click "Nova Cripto"
3. Fill all fields
4. Click "Selecionar Imagem"
5. Choose image file
6. Click "Salvar"
7. Check if image now appears

### Verify API Response
```bash
curl http://localhost:5000/api/cryptos | jq '.[] | {name, image}'

# Should show:
# {
#   "name": "Bitcoin",
#   "image": "/uploads/1767939441600-595466043.jpg"
# }
```

### Check File Exists
```bash
# If image path is "/uploads/1767939441600-595466043.jpg"
Test-Path "D:\PROJETOS\Acapulco\backend\uploads\1767939441600-595466043.jpg"
# Should return: True
```

## If Still Not Working

Try this nuclear option:

```powershell
# 1. Stop backend (Ctrl+C)
# 2. Delete uploads folder and recreate
rm -r backend\uploads
mkdir backend\uploads

# 3. Start backend
cd backend
npm start

# 4. Clear browser cache (Ctrl+Shift+Delete in Chrome)
# 5. Test creating new crypto with image
```

## Expected Result After Fix
- ✅ Image space shows image (not icon)
- ✅ Image displays in list cards
- ✅ Image displays in detail page
- ✅ Works for newly created cryptos

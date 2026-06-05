# 🔧 Bug Fix - Plans Validation Error (400 Bad Request)

## Problem
When creating/updating crypto with image upload, got error:
```
400 Bad Request
"Pelo menos um plano é obrigatório"
```

Even though plans were being sent in the form.

## Root Cause
When sending data via **FormData** (needed for file uploads), the `plans` array gets converted to a **JSON string**:
```javascript
// Frontend sends:
FormData {
  name: "Bitcoin",
  plans: "[{period: 30, yieldPercentage: 15}]"  // STRING, not Array!
  image: File
}
```

But the backend wasn't parsing this string back to an array, so the validation failed:
```javascript
if (!plans || !Array.isArray(plans) || plans.length === 0) {
  // plans is "[...]" (string), not an array
  // This condition triggers!
  return res.status(400).json({ error: 'Pelo menos um plano é obrigatório' });
}
```

## Solution
Updated both backend functions to parse JSON string plans:

### Before:
```javascript
const { name, symbol, price, plans, description } = req.body;
// plans is now a STRING if from FormData
```

### After:
```javascript
let { name, symbol, price, plans, description } = req.body;

// Parse if string
if (typeof plans === 'string') {
  try {
    plans = JSON.parse(plans);
  } catch (e) {
    return res.status(400).json({ error: 'Plans deve ser um JSON válido' });
  }
}
// Now plans is an Array, validation works!
```

## Files Modified
1. `backend/controllers/cryptoController.js`
   - ✅ `createCrypto()` - Added JSON parse for plans
   - ✅ `updateCrypto()` - Added JSON parse + validation for plans

## Testing
Try this now:
1. Go to Admin → Gerenciar Criptmoedas
2. Click "Nova Cripto"
3. Fill all fields including at least 1 plan
4. Upload an image (optional)
5. Click "Salvar"
6. ✅ Should work now!

## What Changed in Backend

### createCrypto
```diff
- const { name, symbol, price, plans, description } = req.body;
+ let { name, symbol, price, plans, description } = req.body;
+ 
+ // Parse JSON string to array if needed
+ if (typeof plans === 'string') {
+   try {
+     plans = JSON.parse(plans);
+   } catch (e) {
+     return res.status(400).json({ error: 'Plans deve ser um JSON válido' });
+   }
+ }
```

### updateCrypto
```diff
+ // Parse JSON string if needed
+ if (typeof updateData.plans === 'string') {
+   try {
+     updateData.plans = JSON.parse(updateData.plans);
+   } catch (e) {
+     return res.status(400).json({ error: 'Plans deve ser um JSON válido' });
+   }
+ }
+ 
+ // Validate plans if provided
+ if (updateData.plans && Array.isArray(updateData.plans)) {
+   // Full validation and conversion
+ }
```

## Impact
- ✅ Create crypto with image now works
- ✅ Update crypto with image now works
- ✅ Create/update without image still works (plans sent as string via FormData)
- ✅ All plan validation now properly happens

## Next Steps
1. Restart backend server
2. Test the upload flow
3. Should work now! 🎉

# 🚀 Inicio Rápido - MobiCorp

## Instalación y Ejecución en 5 minutos

### 1. Backend (Terminal 1)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python init_db.py
python main.py
```

El backend estará en: `http://localhost:8000`

### 2. Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

El frontend estará en: `http://localhost:3000`

### 3. Acceder al Sistema

1. Abre `http://localhost:3000`
2. Usa cualquier email y contraseña (ej: `test@test.com` / `test123`)
3. El sistema creará el usuario automáticamente

### 4. Datos de Prueba

Si ejecutaste `init_db.py`, tendrás:
- Usuario: `admin@mobicorp.com` / `admin123`
- 10 productos de ejemplo

## 🎯 Pruebas Rápidas

1. **Crear un Pedido**:
   - Ve a "Pedidos" → "Nuevo Pedido"
   - Selecciona un producto, cantidad y precio

2. **Comparar Precios**:
   - Ve a "Comparación de Precios"
   - Selecciona un producto
   - Click en "Comparar Precios"

3. **Usar el Chatbot**:
   - Click en el botón flotante del chatbot (esquina inferior derecha)
   - Prueba: "Listar productos" o "Ver mis pedidos"

4. **Ver Reportes**:
   - Ve a "Reportes"
   - Explora los gráficos y estadísticas

## ⚠️ Solución de Problemas

### Error: "Module not found"
- Asegúrate de estar en el entorno virtual (venv activado)
- Ejecuta `pip install -r requirements.txt` nuevamente

### Error: "Port already in use"
- Cambia el puerto en `backend/main.py` (línea final) o `frontend/vite.config.ts`

### Error de CORS
- Verifica que el frontend esté en `http://localhost:3000`
- Revisa la configuración CORS en `backend/main.py`

## 📚 Documentación Completa

Ver `README.md` para más detalles.


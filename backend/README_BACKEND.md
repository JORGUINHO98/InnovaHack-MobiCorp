# Backend MobiCorp - Guía de Instalación

## Requisitos
- Python 3.14.0 (o superior)
- pip (gestor de paquetes de Python)

## Instalación

### 1. Crear entorno virtual (Recomendado)

**Windows:**
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Inicializar base de datos

```bash
python init_db.py
```

Esto creará:
- La base de datos SQLite (`mobicorp.db`)
- Un usuario administrador de ejemplo: `admin@mobicorp.com` / `admin123`
- 10 productos de ejemplo

### 4. Ejecutar el servidor

```bash
python main.py
```

El servidor estará disponible en: `http://localhost:8000`

### 5. Documentación de la API

Una vez que el servidor esté corriendo, puedes acceder a:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Solución de Problemas

### Error: "Module not found"
- Asegúrate de estar en el entorno virtual (venv activado)
- Ejecuta `pip install -r requirements.txt` nuevamente

### Error: "datetime.utcnow() is deprecated"
- Ya está corregido en el código actual
- Si ves este error, asegúrate de tener la última versión del código

### Error: "Port 8000 already in use"
- Cambia el puerto en `main.py` (última línea): `uvicorn.run(app, host="0.0.0.0", port=8001)`

### Error con Python 3.14
- Todas las dependencias han sido actualizadas para ser compatibles con Python 3.14
- Se corrigió el uso de `datetime.utcnow()` (deprecado) por `datetime.now(timezone.utc)`
- Se actualizó la sintaxis de Pydantic v2

## Estructura del Proyecto

```
backend/
├── main.py              # Aplicación FastAPI principal
├── database.py          # Configuración de base de datos
├── models.py            # Modelos SQLAlchemy
├── schemas.py           # Esquemas Pydantic
├── auth.py              # Autenticación JWT
├── price_scraper.py     # Motor de web scraping
├── chatbot.py           # Lógica del chatbot
├── init_db.py           # Script de inicialización
├── requirements.txt     # Dependencias
└── mobicorp.db          # Base de datos SQLite (se crea automáticamente)
```

## Endpoints Principales

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/products` - Listar productos
- `POST /api/orders` - Crear pedido
- `POST /api/prices/suggest` - Obtener precio sugerido
- `POST /api/chat` - Chatbot


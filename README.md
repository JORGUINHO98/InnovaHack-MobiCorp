# MobiCorp - Sistema de Gestión de Pedidos y Comparación de Precios

Sistema inteligente para automatizar el registro de pedidos de venta y realizar comparaciones inteligentes de precios del mercado en tiempo real.

## 🚀 Características

- **Registro Digital de Pedidos**: Sistema completo de gestión de pedidos de venta
- **Comparación Automática de Precios**: Web scraping inteligente para obtener precios del mercado
- **Chatbot Asistente**: Asistente virtual para ayudar al personal de ventas
- **Panel de Visualización**: Dashboard con alertas de variaciones de precios
- **Reportes y Análisis**: Generación de reportes históricos y análisis de márgenes
- **Interfaz Moderna**: UI simple y usable diseñada para personal de ventas

## 📋 Requisitos

- Python 3.8+
- Node.js 16+
- npm o yarn

## 🛠️ Instalación

### Backend

1. Navegar a la carpeta del backend:
```bash
cd backend
```

2. Crear entorno virtual (recomendado):
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Iniciar el servidor:
```bash
python main.py
```

El backend estará disponible en `http://localhost:8000`

### Frontend

1. Navegar a la carpeta del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## 📖 Uso

### Primera vez

1. Inicia el backend y el frontend
2. Accede a `http://localhost:3000`
3. En la pantalla de login, puedes usar cualquier email y contraseña
4. El sistema creará el usuario automáticamente si no existe

### Funcionalidades Principales

#### 1. Dashboard
- Vista general de estadísticas
- Acceso rápido a las principales funciones

#### 2. Productos
- Registrar nuevos productos
- Ver lista de productos disponibles
- Buscar productos por nombre o categoría

#### 3. Pedidos
- Crear nuevos pedidos
- Ver historial de pedidos
- Aprobar pedidos con precio final

#### 4. Comparación de Precios
- Seleccionar un producto
- Generar comparación automática de precios del mercado
- Ver precio sugerido basado en análisis de mercado
- Ver alertas de variación de precios

#### 5. Reportes
- Ver estadísticas generales
- Análisis de márgenes
- Gráficos de pedidos y ventas
- Exportar reportes (en desarrollo)

#### 6. Chatbot
- Click en el botón flotante del chatbot
- Hacer preguntas sobre productos, precios, pedidos
- Obtener ayuda y estadísticas

## 🏗️ Arquitectura

### Backend (FastAPI)
- **main.py**: Punto de entrada y rutas principales
- **database.py**: Configuración de base de datos SQLite
- **models.py**: Modelos de datos (User, Product, Order, PriceComparison, PriceAlert)
- **schemas.py**: Esquemas Pydantic para validación
- **auth.py**: Sistema de autenticación JWT
- **price_scraper.py**: Motor de web scraping para comparación de precios
- **chatbot.py**: Lógica del chatbot asistente

### Frontend (React + TypeScript)
- **pages/**: Páginas principales (Login, Dashboard, Products, Orders, etc.)
- **components/**: Componentes reutilizables (Layout, Chatbot)
- **contexts/**: Contextos de React (AuthContext)
- **api/**: Cliente API para comunicación con el backend

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación. Los tokens se almacenan en localStorage del navegador.

## 📊 Base de Datos

Se utiliza SQLite para desarrollo. La base de datos se crea automáticamente al iniciar el backend.

### Modelos principales:
- **Users**: Usuarios del sistema
- **Products**: Catálogo de productos
- **Orders**: Pedidos de venta
- **PriceComparisons**: Historial de comparaciones de precios
- **PriceAlerts**: Alertas de variación de precios

## 🤖 Chatbot

El chatbot puede responder a:
- Consultas sobre productos y precios
- Información sobre pedidos
- Comparaciones de mercado
- Reportes y estadísticas
- Ayuda general

Comandos útiles:
- "Listar productos"
- "Ver mis pedidos"
- "Comparar precios de [producto]"
- "Mostrar reporte de ventas"

## 🔍 Web Scraping

El sistema incluye un motor de web scraping que:
- Simula la búsqueda en múltiples fuentes del mercado
- Calcula estadísticas (mínimo, máximo, promedio)
- Sugiere precios óptimos basados en el análisis

**Nota**: En producción, se debe implementar scraping real de sitios web específicos o integración con APIs de precios.

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `GET /api/products/{id}` - Obtener producto

### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Crear pedido
- `GET /api/orders/{id}` - Obtener pedido
- `POST /api/orders/{id}/approve` - Aprobar pedido

### Precios
- `POST /api/prices/suggest` - Obtener precio sugerido
- `GET /api/prices/comparisons` - Historial de comparaciones
- `GET /api/prices/alerts` - Alertas de precio

### Chatbot
- `POST /api/chat` - Enviar mensaje al chatbot

### Reportes
- `GET /api/reports/orders` - Reporte de pedidos
- `GET /api/reports/margins` - Reporte de márgenes

## 🚧 Próximas Mejoras

- [ ] Implementar scraping real de sitios web
- [ ] Exportación de reportes a Excel/PDF
- [ ] Notificaciones en tiempo real
- [ ] Integración con APIs de precios externas
- [ ] Sistema de roles y permisos avanzado
- [ ] Historial de cambios de precios
- [ ] Dashboard con más métricas

## 📄 Licencia

Este proyecto fue desarrollado para el hackathon Innova Hack Santa Cruz 2025.

## 👥 Equipo

Desarrollado como solución para el desafío de MobiCorp - Premium Brands.

---

**Nota**: Este es un MVP (Minimum Viable Product) desarrollado para demostración durante el hackathon.


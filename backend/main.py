from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import List, Optional
import uvicorn

from database import SessionLocal, engine, Base
from models import User, Product, Order, PriceComparison, PriceAlert
from schemas import (
    UserCreate, UserResponse, Token, OrderCreate, OrderResponse,
    ProductCreate, ProductResponse, PriceComparisonResponse,
    PriceSuggestion, ChatMessage, ChatResponse
)
from auth import get_current_user, create_access_token, verify_password, get_password_hash
from price_scraper import PriceScraper
from chatbot import ChatbotAssistant

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MobiCorp - Sistema de Gestión de Muebles y Mobiliario",
    description="Sistema especializado en la gestión de ventas de muebles y mobiliario de oficina (sillas ejecutivas, escritorios, mesas, etc.)",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Dependencia para obtener DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Inicializar servicios
price_scraper = PriceScraper()
chatbot = ChatbotAssistant()

# ==================== AUTENTICACIÓN ====================

@app.post("/api/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Registrar nuevo usuario"""
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        role=user.role or "sales"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Iniciar sesión"""
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Obtener información del usuario actual"""
    return current_user

# ==================== PRODUCTOS ====================

@app.get("/api/products", response_model=List[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener lista de productos"""
    query = db.query(Product)
    if category:
        query = query.filter(Product.category == category)
    products = query.offset(skip).limit(limit).all()
    return products

@app.post("/api/products", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear nuevo producto"""
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/api/products/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener producto por ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

# ==================== PEDIDOS ====================

@app.get("/api/orders", response_model=List[OrderResponse])
def get_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener lista de pedidos"""
    orders = db.query(Order).offset(skip).limit(limit).order_by(Order.created_at.desc()).all()
    return orders

@app.post("/api/orders", response_model=OrderResponse)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear nuevo pedido"""
    # Verificar que el producto existe
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    db_order = Order(
        product_id=order.product_id,
        quantity=order.quantity,
        requested_price=order.requested_price,
        user_id=current_user.id,
        status="pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/api/orders/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener pedido por ID"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return order

@app.post("/api/orders/{order_id}/approve")
def approve_order(
    order_id: int,
    final_price: float = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Aprobar pedido con precio final"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    order.final_price = final_price
    order.status = "approved"
    order.approved_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Pedido aprobado exitosamente"}

# ==================== COMPARACIÓN DE PRECIOS ====================

@app.post("/api/prices/suggest", response_model=PriceSuggestion)
def suggest_price(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener precio sugerido basado en comparación de mercado"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Realizar web scraping para obtener precios del mercado
    market_prices = price_scraper.scrape_prices(product.name, product.category)
    
    if not market_prices:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron precios en el mercado para este producto"
        )
    
    # Calcular estadísticas
    prices = [p["price"] for p in market_prices]
    min_price = min(prices)
    max_price = max(prices)
    avg_price = sum(prices) / len(prices)
    
    # Precio sugerido basado en promedio de mercado
    suggested_price = avg_price
    
    # Guardar comparación en BD
    comparison = PriceComparison(
        product_id=product_id,
        min_price=min_price,
        max_price=max_price,
        avg_price=avg_price,
        suggested_price=suggested_price,
        source_count=len(market_prices),
        user_id=current_user.id
    )
    db.add(comparison)
    db.commit()
    
    # Verificar alertas de precio
    if product.price and abs(product.price - avg_price) / product.price > 0.1:  # 10% de variación
        alert = PriceAlert(
            product_id=product_id,
            old_price=product.price,
            new_price=avg_price,
            variation_percent=((avg_price - product.price) / product.price) * 100
        )
        db.add(alert)
        db.commit()
    
    return {
        "suggested_price": suggested_price,
        "min_price": min_price,
        "max_price": max_price,
        "avg_price": avg_price,
        "market_sources": market_prices,
        "comparison_id": comparison.id
    }

@app.get("/api/prices/comparisons", response_model=List[PriceComparisonResponse])
def get_price_comparisons(
    product_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener historial de comparaciones de precios"""
    query = db.query(PriceComparison)
    if product_id:
        query = query.filter(PriceComparison.product_id == product_id)
    comparisons = query.offset(skip).limit(limit).order_by(PriceComparison.created_at.desc()).all()
    return comparisons

@app.get("/api/prices/alerts")
def get_price_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener alertas de variación de precios"""
    alerts = db.query(PriceAlert).order_by(PriceAlert.created_at.desc()).limit(50).all()
    return [
        {
            "id": alert.id,
            "product_id": alert.product_id,
            "product_name": alert.product.name if alert.product else "N/A",
            "old_price": alert.old_price,
            "new_price": alert.new_price,
            "variation_percent": alert.variation_percent,
            "created_at": alert.created_at
        }
        for alert in alerts
    ]

# ==================== CHATBOT ====================

@app.post("/api/chat", response_model=ChatResponse)
def chat(
    message: ChatMessage,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Chatbot para asistencia al personal de ventas"""
    response = chatbot.process_message(message.message, db, current_user)
    return {"response": response}

# ==================== REPORTES ====================

@app.get("/api/reports/orders")
def get_orders_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generar reporte de pedidos"""
    query = db.query(Order)
    
    if start_date:
        query = query.filter(Order.created_at >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.filter(Order.created_at <= datetime.fromisoformat(end_date))
    
    orders = query.all()
    
    return {
        "total_orders": len(orders),
        "total_revenue": sum(o.final_price or 0 for o in orders),
        "pending_orders": len([o for o in orders if o.status == "pending"]),
        "approved_orders": len([o for o in orders if o.status == "approved"]),
        "orders": [
            {
                "id": o.id,
                "product_name": o.product.name,
                "quantity": o.quantity,
                "final_price": o.final_price,
                "status": o.status,
                "created_at": o.created_at
            }
            for o in orders
        ]
    }

@app.get("/api/reports/margins")
def get_margins_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generar reporte de márgenes"""
    orders = db.query(Order).filter(Order.status == "approved").all()
    
    margins = []
    for order in orders:
        if order.final_price and order.product.price:
            cost = order.product.price * order.quantity
            revenue = order.final_price * order.quantity
            margin = ((revenue - cost) / revenue) * 100 if revenue > 0 else 0
            margins.append({
                "order_id": order.id,
                "product_name": order.product.name,
                "cost": cost,
                "revenue": revenue,
                "margin_percent": margin
            })
    
    return {
        "total_margin": sum(m["revenue"] - m["cost"] for m in margins),
        "avg_margin_percent": sum(m["margin_percent"] for m in margins) / len(margins) if margins else 0,
        "margins": margins
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


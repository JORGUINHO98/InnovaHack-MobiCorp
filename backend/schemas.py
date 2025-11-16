from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime

# ==================== USUARIOS ====================

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[str] = "sales"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    is_active: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

# ==================== PRODUCTOS ====================

class ProductBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    sku: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime

# ==================== PEDIDOS ====================

class OrderBase(BaseModel):
    product_id: int
    quantity: int
    requested_price: float

class OrderCreate(OrderBase):
    pass

class OrderResponse(OrderBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    final_price: Optional[float]
    status: str
    user_id: int
    created_at: datetime
    approved_at: Optional[datetime]
    product: ProductResponse

# ==================== COMPARACIÓN DE PRECIOS ====================

class MarketSource(BaseModel):
    source: str
    price: float
    url: Optional[str] = None

class PriceSuggestion(BaseModel):
    suggested_price: float
    min_price: float
    max_price: float
    avg_price: float
    market_sources: List[MarketSource]
    comparison_id: int

class PriceComparisonResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    product_id: int
    min_price: float
    max_price: float
    avg_price: float
    suggested_price: float
    source_count: int
    created_at: datetime
    product: ProductResponse

# ==================== CHATBOT ====================

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str


"""
Script para inicializar la base de datos con datos de ejemplo
"""
from database import SessionLocal, engine, Base
from models import User, Product
from auth import get_password_hash

# Crear tablas
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Crear usuario de ejemplo
if not db.query(User).filter(User.email == "admin@mobicorp.com").first():
    admin_user = User(
        email="admin@mobicorp.com",
        full_name="Administrador MobiCorp",
        hashed_password=get_password_hash("admin123"),
        role="admin"
    )
    db.add(admin_user)
    print("Usuario administrador creado: admin@mobicorp.com / admin123")



for product_data in sample_products:
    if not db.query(Product).filter(Product.name == product_data["name"]).first():
        product = Product(**product_data)
        db.add(product)
        print(f"Producto creado: {product_data['name']}")

db.commit()
print("\nBase de datos inicializada correctamente!")
db.close()


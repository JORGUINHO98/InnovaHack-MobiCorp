"""
Script para eliminar todos los productos de la base de datos
"""
from database import SessionLocal
from models import Product

db = SessionLocal()

try:
    # Obtener todos los productos
    products = db.query(Product).all()
    
    print(f"=== Eliminando {len(products)} productos ===\n")
    
    deleted_count = 0
    for product in products:
        print(f"Eliminando: {product.name} (ID: {product.id})")
        db.delete(product)
        deleted_count += 1
    
    db.commit()
    print(f"\n{'='*50}")
    print(f"Total de productos eliminados: {deleted_count}")
    print("Base de datos limpiada exitosamente!")
    print(f"{'='*50}")
    
except Exception as e:
    db.rollback()
    print(f"Error al limpiar productos: {e}")
finally:
    db.close()


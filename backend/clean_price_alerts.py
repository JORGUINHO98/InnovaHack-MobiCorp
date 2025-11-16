"""
Script para eliminar todas las alertas de precios de la base de datos
"""
from database import SessionLocal
from models import PriceAlert

db = SessionLocal()

try:
    # Obtener todas las alertas
    alerts = db.query(PriceAlert).all()
    
    print(f"=== Eliminando {len(alerts)} alertas de precios ===\n")
    
    deleted_count = 0
    for alert in alerts:
        print(f"Eliminando alerta ID: {alert.id} - Producto: {alert.product_id}")
        db.delete(alert)
        deleted_count += 1
    
    db.commit()
    print(f"\n{'='*50}")
    print(f"Total de alertas eliminadas: {deleted_count}")
    print("Alertas de precios limpiadas exitosamente!")
    print(f"{'='*50}")
    
except Exception as e:
    db.rollback()
    print(f"Error al limpiar alertas: {e}")
finally:
    db.close()


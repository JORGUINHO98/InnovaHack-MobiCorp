# Solución al Problema de bcrypt/passlib

## Problema
El error se debe a una incompatibilidad entre `passlib` y las versiones nuevas de `bcrypt` (4.0.0+).

## Solución Aplicada
Se cambió de usar `passlib` a usar `bcrypt` directamente, que es más compatible y moderno.

## Pasos para Corregir

### 1. Desinstalar passlib (si está instalado)
```powershell
pip uninstall passlib -y
```

### 2. Instalar bcrypt
```powershell
pip install bcrypt>=4.0.0
```

### 3. Verificar que las dependencias estén actualizadas
```powershell
pip install -r requirements.txt --upgrade
```

### 4. Eliminar la base de datos antigua (opcional, si quieres empezar de cero)
```powershell
# Si existe mobicorp.db, elimínala
Remove-Item mobicorp.db -ErrorAction SilentlyContinue
```

### 5. Ejecutar init_db.py nuevamente
```powershell
python init_db.py
```

### 6. Iniciar el servidor
```powershell
python main.py
```

## Cambios Realizados

1. **auth.py**: Ahora usa `bcrypt` directamente en lugar de `passlib`
2. **requirements.txt**: Eliminado `passlib[bcrypt]`, agregado `bcrypt>=4.0.0`

## Nota
Si ya tienes usuarios en la base de datos creados con passlib, necesitarás:
- Eliminar la base de datos y recrearla, O
- Cambiar las contraseñas de los usuarios existentes


import { useEffect, useState } from 'react'
import api from '../api/client'
import { Plus, Search } from 'lucide-react'

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  description?: string
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/api/products', {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      })
      setShowForm(false)
      setFormData({ name: '', category: '', price: '', stock: '', description: '' })
      fetchProducts()
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error al crear el producto')
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Muebles y Mobiliario</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '500',
          }}
        >
          <Plus size={20} />
          Nuevo Mueble
        </button>
      </div>

      {showForm && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-dark)',
          color: 'var(--text-primary)',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: 'var(--shadow)',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            Crear Nuevo Mueble
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label htmlFor="product-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nombre</label>
                <input
                  id="product-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ej: Silla Ejecutiva Ergonómica"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border-dark)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                    borderRadius: '8px',
                  }}
                />
              </div>
              <div>
                <label htmlFor="product-category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>Categoría</label>
                <select
                  id="product-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border-dark)',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                  }}
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="Sillas Ejecutivas">Sillas Ejecutivas</option>
                  <option value="Escritorios">Escritorios</option>
                  <option value="Mesas de Reunión">Mesas de Reunión</option>
                  <option value="Muebles de Oficina">Muebles de Oficina</option>
                  <option value="Estanterías">Estanterías</option>
                  <option value="Archiveros">Archiveros</option>
                  <option value="Sofás y Sillones">Sofás y Sillones</option>
                  <option value="Muebles de Recepción">Muebles de Recepción</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>
              <div>
                <label htmlFor="product-price" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Precio (Bs.)</label>
                <input
                  id="product-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border-dark)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                    borderRadius: '8px',
                  }}
                />
              </div>
              <div>
                <label htmlFor="product-stock" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Stock</label>
                <input
                  id="product-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border-dark)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                    borderRadius: '8px',
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="product-description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Descripción</label>
              <textarea
                id="product-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Ingrese una descripción del producto (opcional)"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-dark)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Crear Producto
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-dark)',
          color: 'var(--text-primary)',
          padding: '1rem',
          borderRadius: '12px',
          boxShadow: 'var(--shadow)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Search size={20} color="var(--text-tertiary)" />
        <input
          type="text"
          placeholder="Buscar muebles por nombre o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: 'none',
            fontSize: '1rem',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-dark)',
          color: 'var(--text-primary)',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: 'var(--shadow)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {product.name}
            </h3>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>{product.category}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Precio</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  Bs. {product.price.toFixed(2)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Stock</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{product.stock} unidades</p>
              </div>
            </div>
            {product.description && (
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                {product.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
          No se encontraron muebles
        </div>
      )}
    </div>
  )
}


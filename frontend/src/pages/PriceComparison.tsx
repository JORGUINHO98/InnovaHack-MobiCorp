import { useEffect, useState } from 'react'
import api from '../api/client'
import { TrendingUp, RefreshCw } from 'lucide-react'

interface Product {
  id: number
  name: string
  category: string
  price: number | null
}

interface PriceSuggestion {
  suggested_price: number
  min_price: number
  max_price: number
  avg_price: number
  market_sources: Array<{
    source: string
    price: number
    url?: string
  }>
  comparison_id: number
}

export default function PriceComparison() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [suggestion, setSuggestion] = useState<PriceSuggestion | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleCompare = async () => {
    if (!selectedProduct) return

    setLoading(true)
    try {
      const response = await api.post(`/api/prices/suggest?product_id=${selectedProduct}`)
      setSuggestion(response.data)
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Error al comparar precios')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: 'var(--text-primary)' }}>Comparación de Precios</h1>

      {/* Comparación de Precios */}
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
          Generar Comparación de Precios
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label htmlFor="price-comparison-product" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Seleccionar Producto</label>
            <select
              id="price-comparison-product"
              value={selectedProduct || ''}
              onChange={(e) => setSelectedProduct(parseInt(e.target.value) || null)}
              aria-label="Seleccionar producto para comparar precios"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-dark)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            >
              <option value="">Seleccionar un producto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.category}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button
              onClick={handleCompare}
              disabled={!selectedProduct || loading}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading || !selectedProduct ? 'not-allowed' : 'pointer',
                opacity: loading || !selectedProduct ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: '500',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Comparando...
                </>
              ) : (
                <>
                  <TrendingUp size={20} />
                  Comparar Precios
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Resultados de Comparación */}
      {suggestion && (
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
            Resultados de la Comparación
          </h2>

          {/* Precio Sugerido Destacado */}
          <div
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              padding: '2rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              textAlign: 'center',
              border: '2px solid var(--primary)',
            }}
          >
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Precio Sugerido</p>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              Bs. {suggestion.suggested_price.toFixed(2)}
            </p>
            <p style={{ color: 'var(--text-tertiary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Basado en análisis de mercado
            </p>
          </div>

          {/* Estadísticas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-dark)' }}>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Precio Mínimo</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                Bs. {suggestion.min_price.toFixed(2)}
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-dark)' }}>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Precio Promedio</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                Bs. {suggestion.avg_price.toFixed(2)}
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-dark)' }}>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Precio Máximo</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                Bs. {suggestion.max_price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Fuentes del Mercado */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Fuentes del Mercado</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {suggestion.market_sources.map((source, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid var(--border-dark)',
            }}
          >
            <div>
              <p style={{ fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{source.source}</p>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary-light)', fontSize: '0.9rem', textDecoration: 'none' }}
                      >
                        Ver fuente
                      </a>
                    )}
                  </div>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    Bs. {source.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}


import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { productoService } from '../services/productoService';
import { ProductoModal } from '../components/ProductoModal';

const CATEGORIAS = ["Todo", "Smartphones", "Laptops", "Audio", "Accesorios"];

export function Tienda() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todo");
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { agregarAlCarrito } = useContext(CartContext);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Consumo del servicio simulado
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      setError(null); // limpiza errores previos
      try {
        const data = await productoService.obtenerPorCategoria(categoriaActiva);
        setProductos(data);
      } catch (err) {
        setError("Error de conexión. No pudimos cargar el catálogo.");
        console.error("Error al cargar productos:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [categoriaActiva])

  return (
    <div className="page fade-in contenedor tienda-layout">
      <aside className="sidebar-filtros">
        <h3>Categorías</h3>
        <ul className="lista-categorias">
          {CATEGORIAS.map((cat) => (
            <li key={cat}>
              <button 
                className={`btn-cat ${categoriaActiva === cat ? 'activo' : ''}`}
                onClick={() => setCategoriaActiva(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="tienda-main">
        <h2 className="titulo-seccion" style={{ textAlign: 'left' }}>
          {categoriaActiva === "Todo" ? "Todos los Productos" : categoriaActiva}
        </h2>
        
        {/* Mensaje de carga */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem', color: 'var(--accent-red)' }}>
            Cargando catálogo desde el servidor... ⏳
          </div>
        ) : null}

        {/*    MANEJO VISUAL DE ERROR */}
        {error && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center', border: '1px solid #f5c6cb' }}>
            {error}
          </div>
        )}
        
        {!cargando && (
          <div className="grid-productos-tienda">
            {productos.length === 0 ? (
              <p>No hay productos en esta categoría.</p>
            ) : (
              productos.map(prod => (
                /* 1. CAMBIO: Añadimos onClick a todo el cuadro y estilo cursor */
                <article 
                  key={prod.id} 
                  className="card-producto" 
                  itemScope 
                  itemType="https://schema.org/Product"
                  onClick={() => setProductoSeleccionado(prod)} // Abre el modal
                  style={{ cursor: 'pointer' }} // Indica que es clickeable
                >
                  <img src={prod.imagen} alt={prod.nombre} itemProp="image" loading="lazy" />
                  <div className="info">
                    <span className="badge">{prod.categoria}</span>
                    <h3 style={{ fontSize: '1.1rem' }} itemProp="name">{prod.nombre}</h3>
                    <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                      <meta itemProp="priceCurrency" content="PEN" />
                      <p className="precio">S/ <span itemProp="price">{prod.precio.toFixed(2)}</span></p>
                    </div>
                    
                    {/* 2. CAMBIO: Revertimos botón a "Agregar al carrito" directo */}
                    <button 
                      className="btn-primary w-100" 
                      onClick={(e) => {
                        /* 3. CAMBIO CRUCIAL: Evitamos que se abra el modal al presionar el botón */
                        e.stopPropagation(); 
                        agregarAlCarrito(prod); // Agrega cantidad 1 directamente
                      }}
                    >
                      🛒 Agregar al carrito
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
            {productoSeleccionado && (
        <ProductoModal 
          producto={productoSeleccionado} 
          onClose={() => setProductoSeleccionado(null)} 
        />
      )}
    </div>
  );
}
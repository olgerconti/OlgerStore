import { useState } from 'react';
import { productos } from '../data';

const CATEGORIAS = ["Todo", "Smartphones", "Laptops", "Audio", "Accesorios"];

export function Tienda({ agregarAlCarrito }) {
  // Estado para controlar qué categoría está activa
  const [categoriaActiva, setCategoriaActiva] = useState("Todo");

  // Lógica de filtrado
  const productosFiltrados = categoriaActiva === "Todo" 
    ? productos 
    : productos.filter(prod => prod.categoria === categoriaActiva);

  return (
    <div className="page fade-in contenedor tienda-layout">
      
      {/* BARRA LATERAL DE CATEGORÍAS */}
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

      {/* GRILLA DE PRODUCTOS */}
      <div className="tienda-main">
        <h2 className="titulo-seccion" style={{ textAlign: 'left' }}>
          {categoriaActiva === "Todo" ? "Todos los Productos" : categoriaActiva}
        </h2>
        
        <div className="grid-productos-tienda">
          {productosFiltrados.length === 0 ? (
            <p>No hay productos en esta categoría.</p>
          ) : (
            productosFiltrados.map(prod => (
              <article key={prod.id} className="card-producto">
                <img src={prod.imagen} alt={prod.nombre} />
                <div className="info">
                  <span className="badge">{prod.categoria}</span>
                  <h3 style={{ fontSize: '1.1rem' }}>{prod.nombre}</h3>
                  <p className="precio">S/ {prod.precio.toFixed(2)}</p>
                  <button className="btn-primary w-100" onClick={() => agregarAlCarrito(prod)}>
                    🛒 Agregar al carrito
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}
import { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';

export function ProductoModal({ producto, onClose }) {
  const [cantidad, setCantidad] = useState(1);
  const { agregarAlCarrito } = useContext(CartContext);

  if (!producto) return null;

  const handleRestar = () => { if (cantidad > 1) setCantidad(cantidad - 1); };
  const handleSumar = () => { setCantidad(cantidad + 1); };

  const handleAgregar = () => {
    agregarAlCarrito(producto, cantidad);
    onClose(); 
  };

  return (
    <div className="overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        itemScope 
        itemType="https://schema.org/Product" 
        style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', maxWidth: '800px', width: '90%', position: 'relative', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 }}>✖</button>
        
        <div style={{ flex: '1 1 300px' }}>
          <img itemProp="image" src={producto.imagen} alt={producto.nombre} style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} />
        </div>

        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="badge">{producto.categoria}</span>
          <h2 itemProp="name">{producto.nombre}</h2>
          
          <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content="PEN" />
            <h3 style={{ color: 'var(--accent-red)', fontSize: '1.8rem' }}>S/ <span itemProp="price">{producto.precio.toFixed(2)}</span></h3>
          </div>
          
          <div>
            <h4>Características:</h4>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              {producto.caracteristicas && producto.caracteristicas.length > 0 ? (
                producto.caracteristicas.map((caract, index) => <li key={index}>{caract}</li>)
              ) : (
                <li>Detalles técnicos no disponibles.</li>
              )}
            </ul>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-dark)', borderRadius: '5px', overflow: 'hidden' }}>
              <button onClick={handleRestar} style={{ padding: '10px 15px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
              <span style={{ padding: '0 15px', fontWeight: 'bold' }}>{cantidad}</span>
              <button onClick={handleSumar} style={{ padding: '10px 15px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
            </div>
            <button className="btn-primary" onClick={handleAgregar} style={{ flexGrow: 1 }}>
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
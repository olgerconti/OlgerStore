import { useState, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Inicio } from './pages/Inicio';
import { Tienda } from './pages/Tienda';
import { SobreNosotros } from './pages/SobreNosotros';
import { Contacto } from './pages/Contacto';
import { CartProvider, CartContext } from './context/CartContext';
import './index.css';
import { checkoutService } from './services/checkoutService';
import { Checkout } from './pages/Checkout';
// Creamos un componente interno para usar el contexto del carrito en el navbar/sidebar
function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const handlePagar = async () => {
    setProcesando(true);
    try {
      // El Controlador llama al Servicio
      const resultado = await checkoutService.procesarOrden(carrito);
      
      // Si todo sale bien, abrimos WhatsApp
      window.open(resultado.url, '_blank');
      
    } catch (error) {
      // Si el servicio devuelve un error (ej. carrito vacío)
      alert("Atención: " + error.message);
    } finally {
      setProcesando(false);
    }
  };
  
  // Consumimos las variables globales
  const { carrito, eliminarDelCarrito, cantidadTotal, totalPagar } = useContext(CartContext);

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="navbar-content contenedor">
          <Link to="/" className="logo">Olger<span>Store</span></Link>
          
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menú de navegación">
            ☰
          </button>

          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
            <Link to="/tienda" onClick={() => setIsMenuOpen(false)}>Tienda</Link>
            <Link to="/sobre-nosotros" onClick={() => setIsMenuOpen(false)}>Sobre Nosotros</Link>
            <Link to="/contacto" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
          </nav>

          <button className="btn-carrito" onClick={() => setIsCartOpen(true)} aria-label="Ver carrito de compras">
            🛒 <span className="contador">{cantidadTotal}</span>
          </button>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/tienda" element={<Tienda />} /> {/* ¡Ya no pasamos props! */}
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2026 OlgerStore. Todos los derechos reservados. Proyecto React.</p>
      </footer>

      {isCartOpen && (
        <>
          <div className="overlay" onClick={() => setIsCartOpen(false)}></div>
          <aside className="carrito-sidebar" aria-modal="true" role="dialog">
            <div className="carrito-header">
              <h2>Tu Pedido</h2>
              <button onClick={() => setIsCartOpen(false)} aria-label="Cerrar carrito">✖</button>
            </div>
            <div className="carrito-items">
              {carrito.length === 0 ? <p>Carrito vacío</p> : (
                carrito.map((item) => (
                  <div key={item.id} className="item-carrito">
                    <div>
                      <h4>{item.nombre} (x{item.cantidad})</h4>
                      <p>S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                    </div>
                    <button onClick={() => eliminarDelCarrito(item.id)} className="btn-eliminar" aria-label={`Eliminar ${item.nombre}`}>🗑️</button>
                  </div>
                ))
              )}
            </div>
            <div className="carrito-footer">
              <h3>Total: S/ {totalPagar.toFixed(2)}</h3>
              <Link 
                to="/checkout" 
                className="btn-primary w-100" 
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }} 
                onClick={() => setIsCartOpen(false)}
              >
                Ir al Checkout
              </Link>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
}

export default App;
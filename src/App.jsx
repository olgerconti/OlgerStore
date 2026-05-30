import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Inicio } from './pages/Inicio';
import { Tienda } from './pages/Tienda';
import { SobreNosotros } from './pages/SobreNosotros';
import { Contacto } from './pages/Contacto';
import './index.css';



function App() {
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Para el menú de celular

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const eliminarDelCarrito = (index) => {
    const nuevo = [...carrito];
    nuevo.splice(index, 1);
    setCarrito(nuevo);
  };

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <Router>
      <div className="app-container">
        
        {/* NAVBAR RESPONSIVE */}
        <header className="navbar">
          <div className="navbar-content contenedor">
            <Link to="/" className="logo">Olger<span>Store</span></Link>
            
            {/* Botón hamburguesa para móviles */}
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              ☰
            </button>

            <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
              <Link to="/tienda" onClick={() => setIsMenuOpen(false)}>Tienda</Link>
              <Link to="/sobre-nosotros" onClick={() => setIsMenuOpen(false)}>Sobre Nosotros</Link>
              <Link to="/contacto" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
            </nav>

            <button className="btn-carrito" onClick={() => setIsCartOpen(true)}>
              🛒 <span className="contador">{carrito.length}</span>
            </button>
          </div>
        </header>

        {/* RUTAS DE LAS PÁGINAS */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/tienda" element={<Tienda agregarAlCarrito={agregarAlCarrito} />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <footer className="footer">
          <p>© 2026 OlgerStore. Todos los derechos reservados. Proyecto React.</p>
        </footer>

        {/* SIDEBAR DEL CARRITO */}
        {isCartOpen && (
          <>
            <div className="overlay" onClick={() => setIsCartOpen(false)}></div>
            <aside className="carrito-sidebar">
              <div className="carrito-header">
                <h2>Tu Pedido</h2>
                <button onClick={() => setIsCartOpen(false)}>✖</button>
              </div>
              <div className="carrito-items">
                {carrito.length === 0 ? <p>Carrito vacío</p> : (
                  carrito.map((item, idx) => (
                    <div key={idx} className="item-carrito">
                      <div>
                        <h4>{item.nombre}</h4>
                        <p>S/ {item.precio.toFixed(2)}</p>
                      </div>
                      <button onClick={() => eliminarDelCarrito(idx)} className="btn-eliminar">🗑️</button>
                    </div>
                  ))
                )}
              </div>
              <div className="carrito-footer">
                <h3>Total: S/ {total.toFixed(2)}</h3>
                <button className="btn-primary w-100" disabled={carrito.length === 0}>Pagar</button>
              </div>
            </aside>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
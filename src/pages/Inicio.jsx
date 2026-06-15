import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productoService } from '../services/productoService';

export function Inicio() {
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        // Consumimos el servicio pidiendo todos los productos
        const todos = await productoService.obtenerPorCategoria("Todo");
        // Filtramos solo los que tienen destacado: true
        const filtrados = todos.filter(p => p.destacado);
        setDestacados(filtrados);
      } catch (error) {
        console.error("Error al cargar destacados", error);
      }
    };
    cargarDestacados();
  }, []);
  
  return (
    <div className="page fade-in">
      <section className="hero">
        <div className="hero-content">
          <h1>Tecnología que impulsa tu mundo</h1>
          <p>Descubre los mejores equipos con calidad garantizada.</p>
          <Link to="/tienda" className="btn-primary">Ver Catálogo</Link>
        </div>
      </section>
      
      <section className="seccion-destacados">
        <h2 className="titulo-seccion">Productos Estrella</h2>
        <div className="grid-productos">
          {destacados.map(prod => (
            <article key={prod.id} className="card-producto">
              {/* Ojo: Como las imágenes están en la carpeta public, la ruta relativa funciona perfecto */}
              <img src={prod.imagen} alt={prod.nombre} />
              <div className="info">
                <h3>{prod.nombre}</h3>
                <p className="precio">S/ {prod.precio.toFixed(2)}</p>
                <Link to="/tienda" className="btn-secondary">Ir a comprar</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
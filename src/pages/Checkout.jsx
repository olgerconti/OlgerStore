import { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { checkoutService } from '../services/checkoutService';

export function Checkout() {
  const { carrito, totalPagar, actualizarCantidad, eliminarDelCarrito } = useContext(CartContext);
  const [paso, setPaso] = useState(1);
  const [datosEnvio, setDatosEnvio] = useState({ correo: '', nombre: '', direccion: 'Cusco' });
  const [procesando, setProcesando] = useState(false);
  
  // NUEVO: Estado para manejar los errores del formulario
  const [errorFormulario, setErrorFormulario] = useState(null);

  // NUEVO: Función de validación estricta preparada para formularios
  const validarYContinuar = (e) => {
    e.preventDefault(); // Previene que la página se refresque al enviar el formulario
    setErrorFormulario(null); 

    if (!datosEnvio.correo.trim() || !datosEnvio.nombre.trim()) {
      setErrorFormulario("⚠️ Por favor, completa todos los campos para continuar.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datosEnvio.correo)) {
      setErrorFormulario("⚠️ Ingresa un correo electrónico real (ejemplo@correo.com).");
      return;
    }

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(datosEnvio.nombre)) {
      setErrorFormulario("⚠️ El nombre solo debe contener letras. No se permiten números ni símbolos.");
      return;
    }

    setPaso(3);
  };

  const handlePagoLinea = () => {
    alert("Función de pago con tarjeta en desarrollo 🚧");
  };


  const handleWhatsApp = async () => {
    setProcesando(true);
    try {
      const resultado = await checkoutService.procesarOrden(carrito);
      window.open(resultado.url, '_blank');
    } catch (error) {
      alert("Atención: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  if (carrito.length === 0 && paso === 1) {
    return <div className="contenedor text-center page fade-in"><h2>Tu carrito está vacío</h2></div>;
  }

  return (
    <div className="page fade-in contenedor">
      {/* LÍNEA DE TIEMPO VISUAL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '2px solid #334155', paddingBottom: '1rem' }}>
        <h3 style={{ color: paso >= 1 ? 'var(--accent-red)' : 'var(--text-muted)' }}>1. Carro</h3>
        <h3 style={{ color: paso >= 2 ? 'var(--accent-red)' : 'var(--text-muted)' }}>2. Entrega</h3>
        <h3 style={{ color: paso === 3 ? 'var(--accent-red)' : 'var(--text-muted)' }}>3. Pago</h3>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* COLUMNA IZQUIERDA: Contenido Dinámico según el Paso */}
        <div style={{ flex: '1 1 60%', background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px' }}>
          
          {/* PASO 1: VERIFICAR CARRO */}
          {paso === 1 && (
            <div>
              <h2>Revisa tus productos</h2>
              {carrito.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', padding: '1rem 0' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={item.imagen} alt={item.nombre} style={{ width: '60px', borderRadius: '5px' }} />
                    <p>{item.nombre}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}>+</button>
                    <button onClick={() => eliminarDelCarrito(item.id)} style={{ color: 'var(--accent-red)', marginLeft: '1rem' }}>🗑️</button>
                  </div>
                </div>
              ))}
              <button className="btn-primary w-100" style={{ marginTop: '2rem' }} onClick={() => setPaso(2)}>
                Continuar a Entrega
              </button>
            </div>
          )}

          {/* PASO 2: DATOS DE ENTREGA EN FORMA DE FORMULARIO HTML5 */}
          {paso === 2 && (
            <form onSubmit={validarYContinuar}>
              <h2>Ingresa tus datos para continuar</h2>
              
              {errorFormulario && (
                <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginTop: '15px', border: '1px solid #f5c6cb', fontSize: '0.9rem' }}>
                  {errorFormulario}
                </div>
              )}

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label htmlFor="correoInput">Correo electrónico:</label>
                <input 
                  id="correoInput"
                  type="email" 
                  value={datosEnvio.correo} 
                  onChange={e => setDatosEnvio({...datosEnvio, correo: e.target.value})} 
                  placeholder="tu@correo.com" 
                  style={{ borderColor: errorFormulario && !datosEnvio.correo.includes('@') ? 'var(--accent-red)' : '' }}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nombreInput">Nombre completo:</label>
                <input 
                  id="nombreInput"
                  type="text" 
                  value={datosEnvio.nombre} 
                  onChange={e => setDatosEnvio({...datosEnvio, nombre: e.target.value})} 
                  placeholder="Ej. Juan Pérez" 
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary w-100" onClick={() => { setPaso(1); setErrorFormulario(null); }}>Volver</button>
                <button type="submit" className="btn-primary w-100">Ir a Pagar</button>
              </div>
            </form>
          )}

          {/* PASO 3: MÉTODOS DE PAGO */}
          {paso === 3 && (
            <div>
              <h2>Selecciona tu método de pago</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn-secondary w-100" onClick={handlePagoLinea} style={{ padding: '1.5rem', fontSize: '1.2rem' }}>
                  💳 Pagar en línea (Crédito/Débito)
                </button>
                <button className="btn-primary w-100" onClick={handleWhatsApp} disabled={procesando} style={{ padding: '1.5rem', fontSize: '1.2rem', background: '#25D366' }}>
                  {procesando ? 'Procesando...' : '📱 Solicitar por WhatsApp'}
                </button>
              </div>
              <button className="btn-secondary w-100" style={{ marginTop: '2rem', border: 'none' }} onClick={() => setPaso(2)}>
                ← Volver a datos
              </button>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: Resumen fijo */}
        <div style={{ flex: '1 1 30%', background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', height: 'fit-content', position: 'sticky', top: '100px' }}>
          <h3>Resumen de la orden</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <span>Subtotal:</span>
            <span>S/ {(totalPagar / 1.18).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span>IGV (18%):</span>
            <span>S/ {(totalPagar - (totalPagar / 1.18)).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #334155', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Total:</span>
            <span>S/ {totalPagar.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
import { useState } from 'react';

export function Contacto() {
  // Manejamos un solo estado para éxito o error
  const [alerta, setAlerta] = useState({ activa: false, tipo: '', texto: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Obtenemos los valores directamente del evento
    const nombre = e.target.nombre.value;
    const mensaje = e.target.mensaje.value;

    // Expresión regular que detecta etiquetas HTML (<etiqueta>)
    const htmlRegex = /<[^>]*>?/gm;

    // Validamos la seguridad antes de procesar nada
    if (htmlRegex.test(nombre) || htmlRegex.test(mensaje)) {
      setAlerta({ 
        activa: true, 
        tipo: 'error', 
        texto: '🚨 no se permiten caracteres especiales como < o >.' 
      });
      
      // Ocultamos la alerta de error después de 4 segundos
      setTimeout(() => setAlerta({ activa: false, tipo: '', texto: '' }), 4000);
      return; // Detenemos la ejecución aquí
    }

    // Si pasa la validación, simulamos el envío exitoso
    setAlerta({ 
      activa: true, 
      tipo: 'exito', 
      texto: '¡Mensaje enviado con éxito! Nos comunicaremos contigo pronto.' 
    });
    
    e.target.reset();
    setTimeout(() => setAlerta({ activa: false, tipo: '', texto: '' }), 4000);
  };

  return (
    <div className="page fade-in contenedor">
      <h2 className="titulo-seccion">Contáctanos</h2>
      <div className="contacto-container">
        
        {/* Renderizado condicional de la alerta (Éxito o Error) */}
        {alerta.activa && (
          <div 
            style={{ 
              backgroundColor: alerta.tipo === 'error' ? '#f8d7da' : '#d4edda', 
              color: alerta.tipo === 'error' ? '#721c24' : '#155724', 
              padding: '15px', 
              borderRadius: '5px', 
              marginBottom: '20px', 
              textAlign: 'center', 
              border: `1px solid ${alerta.tipo === 'error' ? '#f5c6cb' : '#c3e6cb'}` 
            }} 
            role="alert"
          >
            {alerta.texto}
          </div>
        )}

        <form className="formulario" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input type="text" id="nombre" name="nombre" required placeholder="Ingresa tu nombre" />
          </div>
          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input type="email" id="correo" name="correo" required placeholder="tu@correo.com" />
          </div>
          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea id="mensaje" name="mensaje" rows="5" required placeholder="¿En qué te podemos ayudar?"></textarea>
          </div>
          <button type="submit" className="btn-primary w-100">Enviar Mensaje</button>
        </form>
      </div>
    </div>
  );
}
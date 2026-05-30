export function Contacto() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("¡Mensaje enviado con éxito! Nos comunicaremos contigo pronto.");
    e.target.reset();
  };

  return (
    <div className="page fade-in contenedor">
      <h2 className="titulo-seccion">Contáctanos</h2>
      <div className="contacto-container">
        <form className="formulario" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input type="text" required placeholder="Ingresa tu nombre" />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" required placeholder="tu@correo.com" />
          </div>
          <div className="form-group">
            <label>Mensaje</label>
            <textarea rows="5" required placeholder="¿En qué te podemos ayudar?"></textarea>
          </div>
          <button type="submit" className="btn-primary w-100">Enviar Mensaje</button>
        </form>
      </div>
    </div>
  );
}
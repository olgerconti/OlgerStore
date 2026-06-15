export const productoRepository = {
  //  API  alojada en GitHub Pages
  API_URL: "https://olgerconti.github.io/api-olgerstore/productos.json",

  /*
   * trae el JSON crudo.
   * Maneja los errores de conexión HTTP.
   */
  obtenerTodos: async () => {
    try {
      const respuesta = await fetch(productoRepository.API_URL);
      
      if (!respuesta.ok) {
        // Si el servidor responde con error (ej. 404 Not Found)
        throw new Error(`Error del servidor: ${respuesta.status}`);
      }
      
      const datosCrudos = await respuesta.json();
      return datosCrudos;

    } catch (error) {
      // Si hay un error de red (ej. no hay internet)
      console.error("Error en el Repositorio (Capa de Datos):", error);
      throw new Error("No se pudo conectar con la base de datos de productos.");
    }
  }
};
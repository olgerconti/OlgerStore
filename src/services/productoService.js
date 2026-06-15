import { productoRepository } from '../repositories/productoRepository';

export const productoService = {
  
  obtenerPorCategoria: async (categoria) => {
    try {
      const datosCrudos = await productoRepository.obtenerTodos();

      // Mapeador / DTO: Aplicamos reglas de negocio para asegurar los datos
      const productosMapeados = datosCrudos.map(prod => ({
        id: prod.id,
        nombre: prod.nombre || "Producto sin nombre",
        precio: Number(prod.precio) || 0, 
        categoria: prod.categoria || "Otros",
        destacado: Boolean(prod.destacado),
        imagen: prod.imagen || "img/default.jpg",
        
        // ¡ESTA ES LA LÍNEA QUE FALTABA! Le decimos al filtro que deje pasar el arreglo:
        caracteristicas: prod.caracteristicas || [] 
      }));

      // Lógica de negocio: Filtrado de categorías
      if (categoria === "Todo") {
        return productosMapeados;
      }
      return productosMapeados.filter(p => p.categoria === categoria);

    } catch (error) {
      console.error("Error en la Capa de Servicio:", error);
      throw error;
    }
  }
};
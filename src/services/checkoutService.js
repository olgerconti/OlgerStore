export const checkoutService = {
  procesarOrden: async (carrito) => {
    // 1. Validación de negocio
    if (!carrito || carrito.length === 0) {
      throw new Error("El carrito está vacío. Agrega productos para continuar.");
    }

    // 2. Reglas de negocio: Cálculos síncronos
    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const igv = subtotal * 0.18; // 18% de impuestos
    const totalFinal = subtotal + igv;

    // 3. Integración de Servicios Externos: Armado del DTO
    let mensaje = `*¡Hola OlgerStore! Quiero realizar el siguiente pedido:*\n\n`;
    carrito.forEach(item => {
      mensaje += `- ${item.cantidad}x ${item.nombre} (S/ ${(item.precio * item.cantidad).toFixed(2)})\n`;
    });
    mensaje += `\n*Subtotal:* S/ ${subtotal.toFixed(2)}\n`;
    mensaje += `*IGV (18%):* S/ ${igv.toFixed(2)}\n`;
    mensaje += `*Total a Pagar:* S/ ${totalFinal.toFixed(2)}\n\n`;
    mensaje += `Quedo atento a las instrucciones de pago.`;

    const numeroWhatsApp = "51900455718"; 
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    // 4. simulando el tiempo de procesamiento de red 
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    return {
      exito: true,
      url: urlWhatsApp
    };
  }
};
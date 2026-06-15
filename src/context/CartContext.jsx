import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  // Inicializamos el estado leyendo el LocalStorage
  const [carrito, setCarrito] = useState(() => {
    const dataGuardada = localStorage.getItem('olgerStore_carrito');
    return dataGuardada ? JSON.parse(dataGuardada) : [];
  });

  // Guardamos en LocalStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem('olgerStore_carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto, cantidadSeleccionada = 1) => {
    setCarrito((prev) => {
      const itemExiste = prev.find((item) => item.id === producto.id);
      if (itemExiste) {
        // Si ya existe, le sumamos la nueva cantidad que eligió el usuario
        return prev.map((item) => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + cantidadSeleccionada } 
            : item
        );
      }
      // Si no existe, lo agregamos con la cantidad elegida
      return [...prev, { ...producto, cantidad: cantidadSeleccionada }];
    });
  };
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return; // No permitimos cantidades menores a 1
    setCarrito((prev) => 
      prev.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPagar = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, actualizarCantidad, cantidadTotal, totalPagar }}>
      {children}
    </CartContext.Provider>
  );
}
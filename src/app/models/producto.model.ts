
export interface Producto {
    id?: number;          // El ID puede ser opcional al crear un nuevo producto
    nombre: string;
    descripcion: string;
    precio: number;
    usuarioId?: number;   //  es necesario asociar el producto a un usuario
  }
  
  export interface ProductoDTO {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
  }
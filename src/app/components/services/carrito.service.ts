import { Injectable } from '@angular/core';
import { Producto } from '../../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
    private carrito: Producto[] = [];

    agregarProducto(producto: Producto): void {
      this.carrito.push(producto);
    }
  
    obtenerCarrito(): Producto[] {
      return this.carrito;
    }
  
    eliminarProducto(index: number): void {
      this.carrito.splice(index, 1);
    }
  
    vaciarCarrito(): void {
      this.carrito = [];
    }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productos: Producto[] = [
    { id: 1, nombre: 'Producto 1', descripcion: 'Descripción del producto 1', precio: 100 },
    { id: 2, nombre: 'Producto 2', descripcion: 'Descripción del producto 2', precio: 200 },
  ];
  private productosSubject: BehaviorSubject<Producto[]> = new BehaviorSubject<Producto[]>(this.productos);

  constructor() {}

  // Obtener todos los productos
  getAllProductos(): Observable<Producto[]> {
    return this.productosSubject.asObservable();
  }

  // Agregar un nuevo producto
  addProducto(producto: Producto): Observable<any> {
    this.productos.push(producto);
    this.productosSubject.next(this.productos);
    return of({ success: true });
  }

  // Actualizar un producto
  updateProducto(updated: Producto): Observable<any> {
    const index = this.productos.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      this.productos[index] = updated;
      this.productosSubject.next(this.productos);
      return of({ success: true });
    }
    return of({ success: false, message: 'Producto no encontrado' });
  }

  // Eliminar un producto
  deleteProducto(id: number): Observable<any> {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos.splice(index, 1);
      this.productosSubject.next(this.productos);
      return of({ success: true });
    }
    return of({ success: false, message: 'Producto no encontrado' });
  }
}
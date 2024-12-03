import { TestBed } from '@angular/core/testing';
import { CarritoService } from './carrito.service';
import { Producto } from '../../models/producto.model';

describe('CarritoService', () => {
  let service: CarritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a product to the cart', () => {
    const producto: Producto = { id: 1, nombre: 'Producto 1', precio: 100, descripcion: 'Descripción del Producto 1' };
    service.agregarProducto(producto);
    expect(service.obtenerCarrito()).toContain(producto);
  });

  it('should return the products in the cart', () => {
    const producto1: Producto = { id: 1, nombre: 'Producto 1', precio: 100, descripcion: 'Descripción del Producto 1' };
    const producto2: Producto = { id: 2, nombre: 'Producto 2', precio: 200, descripcion: 'Descripción del Producto 2' };
    
    service.agregarProducto(producto1);
    service.agregarProducto(producto2);
    
    const carrito = service.obtenerCarrito();
    expect(carrito.length).toBe(2);
    expect(carrito).toContain(producto1);
    expect(carrito).toContain(producto2);
  });

  it('should remove a product from the cart', () => {
    const producto: Producto = { id: 1, nombre: 'Producto 1', precio: 100, descripcion: 'Descripción del Producto 1' };
    service.agregarProducto(producto);
    service.eliminarProducto(0);
    
    expect(service.obtenerCarrito().length).toBe(0);
  });

  it('should empty the cart', () => {
    const producto1: Producto = { id: 1, nombre: 'Producto 1', precio: 100, descripcion: 'Descripción del Producto 1' };
    const producto2: Producto = { id: 2, nombre: 'Producto 2', precio: 200, descripcion: 'Descripción del Producto 2' };
    
    service.agregarProducto(producto1);
    service.agregarProducto(producto2);
    
    service.vaciarCarrito();
    
    expect(service.obtenerCarrito().length).toBe(0);
  });
});
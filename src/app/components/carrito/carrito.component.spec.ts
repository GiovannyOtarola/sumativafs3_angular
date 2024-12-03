import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoComponent } from './carrito.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CarritoService } from '../services/carrito.service';
import { CompraService } from '../services/compra.service';

import { forkJoin } from 'rxjs';
import { Compra } from '../../models/compra.model';

describe('CarritoComponent', () => {
  let component: CarritoComponent;
  let carritoServiceMock: jasmine.SpyObj<CarritoService>;
  let compraServiceMock: jasmine.SpyObj<CompraService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    carritoServiceMock = jasmine.createSpyObj('CarritoService', ['obtenerCarrito', 'vaciarCarrito', 'eliminarProducto']);
    compraServiceMock = jasmine.createSpyObj('CompraService', ['realizarCompra']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [CarritoComponent],
      providers: [
        { provide: CarritoService, useValue: carritoServiceMock },
        { provide: CompraService, useValue: compraServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    const fixture = TestBed.createComponent(CarritoComponent);
    component = fixture.componentInstance;
  });

  it('should initialize carrito and calculate total on init', () => {
    const mockCarrito = [{ id: 1, nombre: 'Producto 1',descripcion:'Producto 1', precio: 100 }];
    carritoServiceMock.obtenerCarrito.and.returnValue(mockCarrito);

    component.ngOnInit();

    expect(component.carrito).toEqual(mockCarrito);
    expect(component.total).toBe(100);
    expect(carritoServiceMock.obtenerCarrito).toHaveBeenCalled();
  });

  it('should calculate total correctly', () => {
    component.carrito = [
      { id: 1, nombre: 'Producto 1',descripcion:'Producto 1', precio: 100 },
      { id: 2, nombre: 'Producto 2',descripcion:'Producto 1', precio: 200 },
    ];

    component.calcularTotal();

    expect(component.total).toBe(300);
  });

  it('should show error message when trying to purchase with an empty cart', () => {
    component.carrito = [];

    component.realizarCompra();

    expect(component.errorMessage).toBe('El carrito está vacío.');
    expect(compraServiceMock.realizarCompra).not.toHaveBeenCalled();
  });


  it('should perform purchase and clear the cart', () => {
    // Mock del carrito con un producto
    const mockCarrito = [{ id: 1, nombre: 'Producto 1', descripcion: 'Producto 1', precio: 100 }];
    component.carrito = mockCarrito;
  
    // Mock de la respuesta esperada de realizarCompra, devolviendo un objeto de tipo Compra
    const mockCompraResponse: Compra = { productoId: 1, cantidad: 1, usuarioId: 1 }; // Simulando una respuesta de compra exitosa
    compraServiceMock.realizarCompra.and.returnValue(of(mockCompraResponse));
  
    // Mock del servicio de vaciar carrito
    carritoServiceMock.vaciarCarrito.and.callFake(() => {});
  
    // Ejecutar el método realizarCompra
    component.realizarCompra();
  
    // Verificar que el método realizarCompra fue llamado con los datos correctos
    expect(compraServiceMock.realizarCompra).toHaveBeenCalledWith({
      productoId: 1,  // ID del producto
      cantidad: 1,    // Cantidad fija como 1
      usuarioId: 1    // ID del usuario
    });
  
    // Verificar que se establece el mensaje de éxito
    expect(component.successMessage).toBe('Compra realizada correctamente.');
  
    // Verificar que el carrito se vacía
    expect(carritoServiceMock.vaciarCarrito).toHaveBeenCalled();
  
    // Verificar que el carrito del componente está vacío
    expect(component.carrito).toEqual([]);
  
    // Verificar que el total del carrito se recalcula como 0
    expect(component.total).toBe(0);
  });

  it('should show error message on purchase failure', () => {
    const mockCarrito = [{ id: 1, nombre: 'Producto 1',descripcion:'Producto 1', precio: 100 }];
    component.carrito = mockCarrito;

    compraServiceMock.realizarCompra.and.returnValue(throwError(() => new Error('Error al realizar la compra')));

    component.realizarCompra();

    expect(component.errorMessage).toBe('Error al realizar la compra.');
    expect(component.successMessage).toBe('');
  });

  it('should remove a product from the cart', () => {
    const mockCarrito = [
      { id: 1, nombre: 'Producto 1', descripcion: 'Producto 1', precio: 100 },
      { id: 2, nombre: 'Producto 2', descripcion: 'Producto 2', precio: 200 }
    ];
  
    // Configurar el mock de obtenerCarrito y eliminarProducto
    carritoServiceMock.obtenerCarrito.and.returnValue(mockCarrito);
    carritoServiceMock.eliminarProducto.and.callFake((index: number) => {
      mockCarrito.splice(index, 1); // Simula la eliminación del producto
    });
  
    // Inicializar el carrito en el componente
    component.carrito = mockCarrito;
  
    // Ejecutar el método eliminarProducto
    component.eliminarProducto(0); // Eliminar el primer producto
  
    // Verificar que se llamó al servicio de eliminación con el índice correcto
    expect(carritoServiceMock.eliminarProducto).toHaveBeenCalledWith(0);
  
    // Verificar que el carrito se haya actualizado correctamente
    expect(carritoServiceMock.obtenerCarrito).toHaveBeenCalled();
    expect(component.carrito).toEqual([{ id: 2, nombre: 'Producto 2', descripcion: 'Producto 2', precio: 200 }]);
  
    // Verificar que el total se haya recalculado correctamente
    expect(component.total).toBe(200); // Total debería ser el precio del segundo producto
  });
});
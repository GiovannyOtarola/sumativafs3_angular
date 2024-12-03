import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosComponent } from './productos.component';
import { ProductoService } from '../services/producto.service';
import { CarritoService } from '../services/carrito.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductoDTO } from '../../models/producto.model';

class MockProductoService {
  obtenerTodosLosProductos() {
    return of([{ id: 1, nombre: 'Producto 1', descripcion:'Producto1', precio: 100 }]); // Simulamos productos
  }
}

class MockCarritoService {
  agregarProducto(producto: any) {
    // Simulación de la adición del producto al carrito
  }
}

class MockRouter {
  navigate(path: string[]) {
    // Simulación de la navegación
  }
}

describe('ProductosComponent', () => {
  let component: ProductosComponent;
  let fixture: ComponentFixture<ProductosComponent>;
  let productoService: ProductoService;
  let carritoService: CarritoService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      imports: [ProductosComponent],
      providers: [
        { provide: ProductoService, useClass: MockProductoService },
        { provide: CarritoService, useClass: MockCarritoService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosComponent);
    component = fixture.componentInstance;
    productoService = TestBed.inject(ProductoService);
    carritoService = TestBed.inject(CarritoService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should load products on init', () => {
    spyOn(productoService, 'obtenerTodosLosProductos').and.callThrough(); // Espiamos la llamada

    component.ngOnInit(); // Llamamos al método que carga los productos

    expect(productoService.obtenerTodosLosProductos).toHaveBeenCalled(); // Verificamos que la llamada fue realizada
    expect(component.productos.length).toBeGreaterThan(0); // Verificamos que hay productos cargados
  });

  it('should display an error message if product loading fails', () => {
    const errorMessage = 'Error al obtener los productos.';
    spyOn(productoService, 'obtenerTodosLosProductos').and.returnValue(throwError('Error de red'));

    component.ngOnInit();

    expect(component.errorMessage).toBe(errorMessage); // Verificamos que el mensaje de error esté establecido
  });

  it('should add product to cart when "agregarAlCarrito" is called', () => {
    const producto = { id: 1, nombre: 'Producto 1',descripcion: 'descripcion1', precio: 100 };
    spyOn(carritoService, 'agregarProducto');

    component.agregarAlCarrito(producto);

    expect(carritoService.agregarProducto).toHaveBeenCalledWith(producto); // Verificamos que se haya llamado con el producto correcto
  });

  it('should navigate to cart when "irAlCarrito" is called', () => {
    spyOn(router, 'navigate');

    component.irAlCarrito(); // Llamamos al método que debería navegar al carrito

    expect(router.navigate).toHaveBeenCalledWith(['/carrito']); // Verificamos que la navegación se realizó a la ruta correcta
  });

  it('should navigate to the main page when "volver" is called', () => {
    spyOn(router, 'navigate');

    component.volver(); // Llamamos al método que debería navegar a la página principal

    expect(router.navigate).toHaveBeenCalledWith(['/principal']); // Verificamos que la navegación se realizó a la ruta correcta
  });

});

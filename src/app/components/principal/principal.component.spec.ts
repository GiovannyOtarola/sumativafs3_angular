import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrincipalComponent } from './principal.component';
import { ProductoService } from '../services/producto.service';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

class MockProductoService {
  obtenerTodosLosProductos() {
    return of([{ id: 1, nombre: 'Producto 1', descripcion: 'Desc 1', precio: 100 }]);
  }

  crearProducto(producto: any) {
    return of({ message: 'Producto creado correctamente.' });
  }

  actualizarProducto(id: number, producto: any) {
    return of({ message: 'Producto actualizado correctamente.' });
  }

  eliminarProducto(id: number) {
    return of({ message: 'Producto eliminado correctamente.' });
  }
}

class MockSessionService {
  getSessionStatus() {
    return true; // Simulamos que el usuario está logueado
  }

  getLoggedInUser() {
    return { id: 123, nombre: 'Usuario Prueba' }; // Usuario logueado simulado
  }

  logout() {}
}

class MockRouter {
  navigate(path: string[]) {}
}

describe('PrincipalComponent', () => {
  let component: PrincipalComponent;
  let fixture: ComponentFixture<PrincipalComponent>;
  let productoService: ProductoService;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalComponent], 
      providers: [
        { provide: ProductoService, useClass: MockProductoService },
        { provide: SessionService, useClass: MockSessionService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrincipalComponent);
    component = fixture.componentInstance;
    productoService = TestBed.inject(ProductoService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    spyOn(productoService, 'obtenerTodosLosProductos').and.callThrough();

    component.ngOnInit();

    expect(productoService.obtenerTodosLosProductos).toHaveBeenCalled();
    expect(component.productos.length).toBeGreaterThan(0);
  });

  it('should add a product successfully', () => {
    spyOn(productoService, 'crearProducto').and.callThrough();

    component.productoForm.setValue({
      nombre: 'Nuevo Producto',
      descripcion: 'Descripción del producto',
      precio: 200,
    });
    component.usuarioId = 123;
    component.saveProducto();

    expect(productoService.crearProducto).toHaveBeenCalled();
    expect(component.successMessage).toBe('Producto creado correctamente.');
  });

  it('should update a product successfully', () => {
    spyOn(productoService, 'actualizarProducto').and.callThrough();

    component.editingProducto = { id: 1, nombre: 'Producto Editado', descripcion: '', precio: 150 };
    component.productoForm.setValue({
      nombre: 'Producto Editado',
      descripcion: 'Descripción actualizada',
      precio: 150,
    });
    component.saveProducto();

    expect(productoService.actualizarProducto).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(component.successMessage).toBe('Producto actualizado correctamente.');
  });

  it('should delete a product successfully', () => {
    spyOn(productoService, 'eliminarProducto').and.callThrough();

    component.deleteProducto(1);

    expect(productoService.eliminarProducto).toHaveBeenCalledWith(1);
    expect(component.successMessage).toBe('Producto eliminado correctamente.');
  });

  it('should navigate to login if not logged in', () => {
    spyOn(sessionService, 'getSessionStatus').and.returnValue(false);
    spyOn(router, 'navigate');

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should log out and navigate to login', () => {
    spyOn(sessionService, 'logout').and.callThrough();
    spyOn(router, 'navigate');

    component.logout();

    expect(sessionService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show an error message if form is invalid', () => {
    component.productoForm.setValue({
      nombre: '',
      descripcion: 'Descripción',
      precio: 100,
    });
  
    component.saveProducto();
  
    expect(component.errorMessage).toBe('Por favor, completa todos los campos correctamente.');
  });

  it('should show an error message when loading products fails', () => {
    spyOn(productoService, 'obtenerTodosLosProductos').and.returnValue(throwError('Error'));
  
    component.loadProductos();
  
    expect(component.errorMessage).toBe('Error al obtener los productos.');
  });

  it('should reset the form and cancel edit when cancelEdit is called', () => {
    // Simulamos un producto para editar
    component.editingProducto = { id: 1, nombre: 'Producto Editado', descripcion: 'Descripción', precio: 150 };
    component.productoForm.setValue({
      nombre: 'Producto Editado',
      descripcion: 'Descripción',
      precio: 150
    });
  
    component.cancelEdit();
  
    // Verificamos que el formulario se haya resetado a los valores vacíos
    expect(component.productoForm.get('nombre')?.value).toBe('');
    expect(component.productoForm.get('descripcion')?.value).toBe('');
    expect(component.productoForm.get('precio')?.value).toBe('');
    expect(component.editingProducto).toBeNull();
  });

  it('should redirect to login if session is expired or no session', () => {
    spyOn(sessionService, 'getSessionStatus').and.returnValue(false);
    spyOn(router, 'navigate');
  
    component.ngOnInit();
  
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to perfil page when redirectToPerfil is called', () => {
    spyOn(router, 'navigate');
  
    component.redirectToPerfil();
  
    expect(router.navigate).toHaveBeenCalledWith(['/perfil']);
  });

  it('should delete a product and refresh the product list', () => {
    spyOn(productoService, 'eliminarProducto').and.callThrough();
    spyOn(component, 'refreshProductList').and.callThrough();
  
    component.deleteProducto(1);
  
    expect(productoService.eliminarProducto).toHaveBeenCalledWith(1);
    expect(component.successMessage).toBe('Producto eliminado correctamente.');
    expect(component.refreshProductList).toHaveBeenCalled();
  });

  it('should log out and navigate to login on logout', () => {
    spyOn(sessionService, 'logout').and.callThrough();
    spyOn(router, 'navigate');
  
    component.logout();
  
    expect(sessionService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show an error if user ID is not available when creating a product', () => {
    // Simulamos que no hay un ID de usuario
    component.usuarioId = null;  // O undefined, según el caso
  
    component.productoForm.setValue({
      nombre: 'Nuevo Producto',
      descripcion: 'Descripción del producto',
      precio: 100,
    });
  
    component.saveProducto();
  
    // Verificamos que se haya mostrado el mensaje de error
    expect(component.errorMessage).toBe('No se pudo obtener el ID del usuario.');
  });
});

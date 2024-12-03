import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { UsuarioService } from './usuario.service';
import { Producto, ProductoDTO } from '../../models/producto.model';
import { HttpHeaders } from '@angular/common/http';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UsuarioService', ['getAuthHeaders']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductoService,
        { provide: UsuarioService, useValue: spy }
      ]
    });

    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
    usuarioServiceSpy = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;

    // Mock de cabeceras de autenticación
    usuarioServiceSpy.getAuthHeaders.and.returnValue(
      new HttpHeaders({
        Authorization: 'Basic ' + btoa('admin:password'),
      })
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('crearProducto', () => {
    it('should create a product', () => {
      const producto: Producto = { nombre: 'Producto 1', descripcion: 'Descripción', precio: 100 };

      service.crearProducto(producto).subscribe(response => {
        expect(response).toEqual(producto);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/productos');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Basic ' + btoa('admin:password'));
      req.flush(producto);
    });
  });

  describe('obtenerProductoPorId', () => {
    it('should get a product by id', () => {
      const producto: Producto = { id: 1, nombre: 'Producto 1', descripcion: 'Descripción', precio: 100 };

      service.obtenerProductoPorId(1).subscribe(response => {
        expect(response).toEqual(producto);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/productos/1');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Basic ' + btoa('admin:password'));
      req.flush(producto);
    });
  });

  describe('actualizarProducto', () => {
    it('should update a product', () => {
      const producto: Producto = { id: 1, nombre: 'Producto 1', descripcion: 'Descripción actualizada', precio: 150 };

      service.actualizarProducto(1, producto).subscribe(response => {
        expect(response).toEqual(producto);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/productos/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe('Basic ' + btoa('admin:password'));
      req.flush(producto);
    });
  });

  describe('eliminarProducto', () => {
    it('should delete a product by id', () => {
      usuarioServiceSpy.getAuthHeaders.and.returnValue(new HttpHeaders({
        Authorization: 'Basic ' + btoa('admin:password'),
      }));
  
      service.eliminarProducto(1).subscribe(response => {
        expect(response).toBeNull(); // Cambiar a toBeNull()
      });
  
      const req = httpMock.expectOne('http://localhost:8080/api/productos/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null); // Respuesta simulada como null
    });
  });

  describe('obtenerTodosLosProductos', () => {
    it('should get all products', () => {
      const productos: ProductoDTO[] = [
        { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', precio: 100 },
        { id: 2, nombre: 'Producto 2', descripcion: 'Descripción 2', precio: 200 }
      ];

      service.obtenerTodosLosProductos().subscribe(response => {
        expect(response).toEqual(productos);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/productos');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Basic ' + btoa('admin:password'));
      req.flush(productos);
    });
  });
});
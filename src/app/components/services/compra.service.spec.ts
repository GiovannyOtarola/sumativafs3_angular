import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompraService } from './compra.service';
import { UsuarioService } from './usuario.service';
import { Compra } from '../../models/compra.model';
import { HttpHeaders } from '@angular/common/http';

describe('CompraService', () => {
    let service: CompraService;
    let httpMock: HttpTestingController;
    let usuarioService: jasmine.SpyObj<UsuarioService>;
  
    beforeEach(() => {
      const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['getAuthHeaders']);
  
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          CompraService,
          { provide: UsuarioService, useValue: usuarioServiceSpy }
        ]
      });
  
      service = TestBed.inject(CompraService);
      httpMock = TestBed.inject(HttpTestingController);
      usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    });
  
    afterEach(() => {
      httpMock.verify(); // Asegura que no haya solicitudes HTTP pendientes después de cada prueba.
    });
  
    describe('realizarCompra', () => {
      it('should create a compra and return it', () => {
        // Definir un objeto 'compra' de ejemplo
        const compra: Compra = { productoId: 1, cantidad: 2, usuarioId: 123 };
        const expectedCompra: Compra = { id: 1, ...compra }; // Suponiendo que el backend añade un 'id'
  
        // Simular que el método 'getAuthHeadersPublic' de UsuarioService devuelve los encabezados de autenticación
        usuarioService.getAuthHeaders.and.returnValue(new HttpHeaders({ 'Authorization': 'Bearer token' }));
  
        // Llamada al servicio para realizar la compra
        service.realizarCompra(compra).subscribe(response => {
          expect(response).toEqual(expectedCompra);
        });
  
        // Interceptar la solicitud HTTP para verificar que se haga correctamente
        const req = httpMock.expectOne('http://localhost:8080/api/compras');
        expect(req.request.method).toBe('POST');
        expect(req.request.headers.has('Authorization')).toBeTrue();  // Verifica que el header 'Authorization' esté presente
        req.flush(expectedCompra);  // Simula la respuesta del backend
      });
    });
  });
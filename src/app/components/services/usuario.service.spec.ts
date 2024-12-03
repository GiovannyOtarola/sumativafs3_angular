import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { SessionService } from './session.service';
import { Usuario, UsuarioDTO } from '../../models/usuario.model';
import { of } from 'rxjs';

describe('UsuarioService', () => {
    let service: UsuarioService;
    let httpMock: HttpTestingController;
    let sessionService: jasmine.SpyObj<SessionService>;
  
    beforeEach(() => {
      const sessionServiceSpy = jasmine.createSpyObj('SessionService', ['getLoggedInUser', 'login']);
  
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          UsuarioService,
          { provide: SessionService, useValue: sessionServiceSpy }
        ]
      });
  
      service = TestBed.inject(UsuarioService);
      httpMock = TestBed.inject(HttpTestingController);
      sessionService = TestBed.inject(SessionService) as jasmine.SpyObj<SessionService>;
    });
  
    afterEach(() => {
      httpMock.verify();
    });
  
    describe('crearUsuario', () => {
      it('should create a user and return it', () => {
        const newUser: Usuario = { id: 1, nombre: 'Usuario 1', password: 'password', rol: 'admin' };
  
        service.crearUsuario(newUser).subscribe(response => {
          expect(response).toEqual(newUser);
        });
  
        const req = httpMock.expectOne('http://localhost:8080/api/usuarios');
        expect(req.request.method).toBe('POST');
        req.flush(newUser);
      });
    });
  
    describe('obtenerUsuarioPorId', () => {
      it('should get a user by id', () => {
        const usuario: Usuario = { id: 1, nombre: 'Usuario 1', password: 'password', rol: 'admin' };
        sessionService.getLoggedInUser.and.returnValue(usuario);
  
        service.obtenerUsuarioPorId(1).subscribe(response => {
          expect(response).toEqual(usuario);
        });
  
        const req = httpMock.expectOne('http://localhost:8080/api/usuarios/1');
        expect(req.request.method).toBe('GET');
        req.flush(usuario);
      });
    });
  
    describe('actualizarUsuario', () => {
      it('should update a user and return it', () => {
        const updatedUser: Usuario = { id: 1, nombre: 'Usuario 1', password: 'newpassword', rol: 'admin' };
        sessionService.getLoggedInUser.and.returnValue(updatedUser);
  
        service.actualizarUsuario(1, updatedUser).subscribe(response => {
          expect(response).toEqual(updatedUser);
        });
  
        const req = httpMock.expectOne('http://localhost:8080/api/usuarios/1');
        expect(req.request.method).toBe('PUT');
        req.flush(updatedUser);
      });
    });
  
    describe('eliminarUsuario', () => {
        it('should delete a user by id', () => {
          sessionService.getLoggedInUser.and.returnValue({ id: 1, nombre: 'Admin', password: 'admin', rol: 'admin' });
      
          service.eliminarUsuario(1).subscribe(response => {
            expect(response).toBeNull(); // Ajusta la expectativa a null
          });
      
          const req = httpMock.expectOne('http://localhost:8080/api/usuarios/1');
          expect(req.request.method).toBe('DELETE');
          req.flush(null); // El backend devuelve null para DELETE
        });
      });
      
    describe('obtenerTodosLosUsuarios', () => {
        it('should get all users', () => {
          // Simulamos la respuesta como UsuarioDTO
          const usuariosDTO: UsuarioDTO[] = [
            { id: 1, nombre: 'Usuario 1', password: 'password', rol: 'admin' },
            { id: 2, nombre: 'Usuario 2', password: 'password', rol: 'user' }
          ];
      
          // Espía para el usuario logueado
          sessionService.getLoggedInUser.and.returnValue({ id: 1, nombre: 'Admin', password: 'admin', rol: 'admin' });
      
          // Llamada al servicio
          service.obtenerTodosLosUsuarios().subscribe(response => {
            // Comprobamos que la respuesta coincida con el DTO esperado
            expect(response).toEqual(usuariosDTO);
          });
      
          // Simular la solicitud HTTP
          const req = httpMock.expectOne('http://localhost:8080/api/usuarios');
          expect(req.request.method).toBe('GET');
      
          // Respuesta simulada del servidor
          req.flush(usuariosDTO);
        });
      });
  
    describe('obtenerUsuarioPorNombre', () => {
      it('should get a user by name', () => {
        const usuario: Usuario = { id: 1, nombre: 'Usuario 1', password: 'password', rol: 'admin' };
  
        service.obtenerUsuarioPorNombre('Usuario 1').subscribe(response => {
          expect(response).toEqual(usuario);
        });
  
        const req = httpMock.expectOne('http://localhost:8080/api/usuarios/nombre/Usuario 1');
        expect(req.request.method).toBe('GET');
        req.flush(usuario);
      });
    });
  });
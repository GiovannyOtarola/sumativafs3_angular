import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilComponent } from './perfil.component';
import { UsuarioService } from '../services/usuario.service';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Usuario } from '../../models/usuario.model';


describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let usuarioServiceMock: jasmine.SpyObj<UsuarioService>;
  let sessionServiceMock: jasmine.SpyObj<SessionService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Crear mocks de los servicios
    usuarioServiceMock = jasmine.createSpyObj('UsuarioService', ['obtenerUsuarioPorId', 'actualizarUsuario']);
    sessionServiceMock = jasmine.createSpyObj('SessionService', ['getSessionStatus', 'getLoggedInUser', 'login']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, PerfilComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
  });

  it('should load user profile on init', () => {
    const mockUser: Usuario = { id: 1, nombre: 'Test User', password: 'password', rol: 'user' };
    sessionServiceMock.getSessionStatus.and.returnValue(true);
    sessionServiceMock.getLoggedInUser.and.returnValue({ id: 1 });

    usuarioServiceMock.obtenerUsuarioPorId.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(usuarioServiceMock.obtenerUsuarioPorId).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(mockUser);
    expect(component.editableUser).toEqual({
      nombre: 'Test User',
      password: 'password',
      rol: 'user'
    });
  });

  it('should redirect to login if no user is logged in', () => {
    sessionServiceMock.getSessionStatus.and.returnValue(false);

    component.ngOnInit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should update user profile', () => {
    const mockUser: Usuario = { id: 1, nombre: 'Test User', password: 'password', rol: 'user' };
    sessionServiceMock.getSessionStatus.and.returnValue(true);
    sessionServiceMock.getLoggedInUser.and.returnValue({ id: 1 });
    usuarioServiceMock.obtenerUsuarioPorId.and.returnValue(of(mockUser));

    component.ngOnInit();

    const updatedUser = { nombre: 'Updated User', password: 'newpassword', rol: 'admin' };
    component.editableUser = updatedUser;

    usuarioServiceMock.actualizarUsuario.and.returnValue(of(updatedUser));

    component.saveChanges();

    expect(usuarioServiceMock.actualizarUsuario).toHaveBeenCalledWith(1, updatedUser);
    expect(component.successMessage).toBe('Perfil actualizado correctamente.');
    expect(sessionServiceMock.login).toHaveBeenCalledWith({ ...mockUser, ...updatedUser });
    expect(component.user).toEqual({ ...mockUser, ...updatedUser });
  });

  it('should handle error when updating profile', () => {
    const mockUser: Usuario = { id: 1, nombre: 'Test User', password: 'password', rol: 'user' };
    sessionServiceMock.getSessionStatus.and.returnValue(true);
    sessionServiceMock.getLoggedInUser.and.returnValue({ id: 1 });
    usuarioServiceMock.obtenerUsuarioPorId.and.returnValue(of(mockUser));

    component.ngOnInit();

    const updatedUser = { nombre: 'Updated User', password: 'newpassword', rol: 'admin' };
    component.editableUser = updatedUser;

    usuarioServiceMock.actualizarUsuario.and.returnValue(throwError('Error'));

    component.saveChanges();

    expect(usuarioServiceMock.actualizarUsuario).toHaveBeenCalledWith(1, updatedUser);
    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe('Error al actualizar el perfil.');
  });
});
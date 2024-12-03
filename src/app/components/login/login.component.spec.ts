import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { fakeAsync, tick } from '@angular/core/testing';

// Mock de servicios
class MockUsuarioService {
  login(credentials: any) {
    if (credentials.nombre === 'admin' && credentials.password === 'admin') {
      return of({
        message: 'Inicio de sesión exitoso',
        usuario: { nombre: 'admin', rol: 'admin' }
      });
    } else if (credentials.nombre === 'user' && credentials.password === 'user') {
      return of({
        message: 'Inicio de sesión exitoso',
        usuario: { nombre: 'user', rol: 'user' } // Rol no admin
      });
    } else {
      return throwError({ message: 'Error de conexión o datos incorrectos. Inténtalo de nuevo.' });
    }
  }
}

class MockSessionService {
  private loggedInUser  = null;
  private sessionActive = false;

  login(user: any) {
    this.loggedInUser  = user;
    this.sessionActive = true; // Simula que el usuario ha iniciado sesión
  }

  getLoggedInUser () {
    return this.loggedInUser ;
  }

  getSessionStatus() {
    return this.sessionActive; // Devuelve true si la sesión está activa
  }
}
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        CommonModule,
        LoginComponent
      ],

      providers: [
        { provide: UsuarioService, useClass: MockUsuarioService }, // Usar el mock único
        { provide: SessionService, useClass: MockSessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a login form with required fields', () => {
    expect(component.loginForm.contains('nombre')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should return error if login fails', () => {
    const usuarioService = TestBed.inject(UsuarioService);
    component.loginForm.setValue({ nombre: 'wrongUser ', password: 'wrongPassword' });

    spyOn(usuarioService, 'login').and.callThrough();
    component.login();

    expect(usuarioService.login).toHaveBeenCalledWith({ nombre: 'wrongUser ', password: 'wrongPassword' });
    expect(component.errorMessage).toBe('Error de conexión o datos incorrectos. Inténtalo de nuevo.');
  });

  it('should navigate to admin page if login is successful and user is admin', fakeAsync(() => {
    const usuarioService = TestBed.inject(UsuarioService);
    component.loginForm.setValue({ nombre: 'admin', password: 'admin' });

    spyOn(usuarioService, 'login').and.callThrough();
    spyOn(router, 'navigate');

    component.login();
    tick(); // Simula el paso del tiempo para que se complete la suscripción

    expect(usuarioService.login).toHaveBeenCalledWith({ nombre: 'admin', password: 'admin' });
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  }));

  it('should navigate to principal page if login is successful and user is not admin', fakeAsync(() => {
    const usuarioService = TestBed.inject(UsuarioService);
    component.loginForm.setValue({ nombre: 'user', password: 'user' });

    spyOn(usuarioService, 'login').and.callThrough();
    spyOn(router, 'navigate');

    component.login();
    tick(); // Simula el paso del tiempo para que se complete la suscripción

    expect(usuarioService.login).toHaveBeenCalledWith({ nombre: 'user', password: 'user' });
    expect(router.navigate).toHaveBeenCalledWith(['/principal']);
  }));

  it('should redirect to register page when redirectToRegister is called', () => {
    spyOn(router, 'navigate');

    component.redirectToRegister();

    expect(router.navigate).toHaveBeenCalledWith(['/registro']);
  });

  it('should redirect to recover password page when redirectToRecoverPassword is called', () => {
    spyOn(router, 'navigate');

    component.redirectToRecoverPassword();

    expect(router.navigate).toHaveBeenCalledWith(['/recuperar']);
  });
});
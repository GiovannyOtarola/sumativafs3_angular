import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarPasswordComponent } from './recuperar-password.component';
import { UsuarioService } from '../services/usuario.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';



class MockUsuarioService {
  obtenerUsuarioPorNombre(nombre: string) {
    if (nombre === 'usuarioExistente') {
      return of({ id: 1, nombre: 'usuarioExistente', password: '123456' });
    } else {
      return of(null);
    }
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

describe('RecuperarPasswordComponent', () => {
  let component: RecuperarPasswordComponent;
  let fixture: ComponentFixture<RecuperarPasswordComponent>;
  let usuarioService: UsuarioService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarPasswordComponent], 
      providers: [
        { provide: UsuarioService, useClass: MockUsuarioService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPasswordComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the password if the user is found', () => {
    spyOn(usuarioService, 'obtenerUsuarioPorNombre').and.callThrough();

    component.recuperarForm.setValue({ nombre: 'usuarioExistente' });
    component.recuperarPassword();

    expect(usuarioService.obtenerUsuarioPorNombre).toHaveBeenCalledWith('usuarioExistente');
    expect(component.mensaje).toBe('Tu contraseña es: 123456');
  });

  it('should display an error message if the user is not found', () => {
    spyOn(usuarioService, 'obtenerUsuarioPorNombre').and.callThrough();

    component.recuperarForm.setValue({ nombre: 'usuarioNoExistente' });
    component.recuperarPassword();

    expect(usuarioService.obtenerUsuarioPorNombre).toHaveBeenCalledWith('usuarioNoExistente');
    expect(component.mensaje).toBe('No se encontró un usuario con ese nombre');
  });

  it('should display a connection error message on failure', () => {
    spyOn(usuarioService, 'obtenerUsuarioPorNombre').and.returnValue(throwError(() => new Error('Connection error')));

    component.recuperarForm.setValue({ nombre: 'usuarioExistente' });
    component.recuperarPassword();

    expect(usuarioService.obtenerUsuarioPorNombre).toHaveBeenCalledWith('usuarioExistente');
    expect(component.mensaje).toBe('Error de conexión o datos incorrectos. Inténtalo de nuevo.');
  });

  it('should navigate to login page when redirectToLogin is called', () => {
    spyOn(router, 'navigate');

    component.redirectToLogin();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show validation error when form is invalid', () => {
    component.recuperarForm.setValue({ nombre: '' });
    component.recuperarPassword();
  
    expect(component.mensaje).toBe('Por favor, completa todos los campos correctamente.');
  });
});
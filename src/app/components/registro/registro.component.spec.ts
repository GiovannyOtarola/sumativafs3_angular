import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

class MockUsuarioService {
  crearUsuario(usuario: any) {
    if (usuario.nombre === 'admin' && usuario.password === 'admin123') {
      // Simulando una respuesta exitosa con el objeto Usuario
      return of({ nombre: 'admin', password: 'admin123', rol: 'user' });
    } else {
      return throwError({ message: 'Error en el registro' });
    }
  }
}

class MockRouter {
  navigate(path: string[]) {
  }
}

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let usuarioService: UsuarioService;
  let router: Router;
  let usuarioServiceMock: jasmine.SpyObj<UsuarioService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Crear mocks de los servicios
    usuarioServiceMock = jasmine.createSpyObj('UsuarioService', ['crearUsuario']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    usuarioServiceMock.crearUsuario.and.returnValue(of({
      nombre: 'Test User',
      password: 'password123',
      rol: 'user'
    }));

    await TestBed.configureTestingModule({

      imports: [
        RegistroComponent,  // Importamos el componente standalone
        ReactiveFormsModule,
        CommonModule,
        RouterModule
      ],
      providers: [
        { provide: UsuarioService, useClass: MockUsuarioService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    component = TestBed.createComponent(RegistroComponent).componentInstance;
    usuarioService = TestBed.inject(UsuarioService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create a register form with required fields', () => {
    expect(component.registerForm.contains('nombre')).toBeTrue();
    expect(component.registerForm.contains('password')).toBeTrue();
    expect(component.registerForm.contains('rol')).toBeTrue();
  });

  it('should invalidate the form if password is weak', () => {
    component.registerForm.setValue({
      nombre: 'user',
      password: 'weakpass',
      rol: 'user'
    });
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should validate a valid password correctly', () => {
      // Obtén el control de la contraseña
      const passwordControl = component.registerForm.get('password');

      // Establece una contraseña válida
      passwordControl?.setValue('Valid123!');

      // Verifica que el control sea válido
      expect(passwordControl?.valid).toBeTrue(); // Esto debería ser true porque la contraseña cumple con los requisitos
  });






});
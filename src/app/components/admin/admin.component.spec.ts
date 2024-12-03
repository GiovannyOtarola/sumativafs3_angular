
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminComponent } from './admin.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../services/session.service';
import { UsuarioService } from '../services/usuario.service';
import { of } from 'rxjs';
// Mock de servicios
class MockSessionService {
  getSessionStatus() { return true; }
  getLoggedInUser() { return { rol: 'admin' }; }
  logout() { }
}

class MockUsuarioService {
  obtenerTodosLosUsuarios() { return of([{ id: 1, nombre: 'John Doe', password: '1234', rol: 'admin' }]); }
  actualizarUsuario(id: number, user: any) { return of(true); }
  eliminarUsuario(id: number) { return of(true); }
}


describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let sessionService: SessionService;
  let usuarioService: UsuarioService;
  let router: Router;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AdminComponent, // Agregar AdminComponent a "imports" ya que es standalone
          ReactiveFormsModule, 
          RouterTestingModule, 
          CommonModule
        ],
        providers: [
          { provide: SessionService, useClass: MockSessionService },
          { provide: UsuarioService, useClass: MockUsuarioService },
        ],
      })
      .compileComponents();

      fixture = TestBed.createComponent(AdminComponent);
      component = fixture.componentInstance;
      sessionService = TestBed.inject(SessionService);
      usuarioService = TestBed.inject(UsuarioService);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que el componente sea creado correctamente
  });

  it('should call obtenerTodosLosUsuarios on ngOnInit', () => {
    spyOn(usuarioService, 'obtenerTodosLosUsuarios').and.callThrough(); // Espía la llamada al servicio
    component.ngOnInit(); // Llama al método ngOnInit
    expect(usuarioService.obtenerTodosLosUsuarios).toHaveBeenCalled(); // Verifica que se haya llamado al servicio
    expect(component.users.length).toBe(1); // Verifica que se haya cargado al menos un usuario
  });

  it('should edit a user when editUser is called', () => {
    const user = { id: 1, nombre: 'John Doe', password: '1234', rol: 'admin' };
    component.editUser(user); // Llama al método editUser
    expect(component.editingUser).toBe(user); // Verifica que el usuario se haya editado
    expect(component.editUserForm.value.nombre).toBe('John Doe'); // Verifica que el formulario tenga los datos del usuario
  });

  it('should call updateUser and update successMessage', () => {
    const user = { id: 1, nombre: 'John Doe', password: '1234', rol: 'admin' };
    component.editingUser = user;
    component.editUserForm.setValue({ nombre: 'Jane Doe', password: '5678', rol: 'admin' }); // Rellena el formulario

    spyOn(usuarioService, 'actualizarUsuario').and.callThrough(); // Espía la llamada al servicio
    component.updateUser(); // Llama al método updateUser

    expect(usuarioService.actualizarUsuario).toHaveBeenCalledWith(user.id, {
      id: user.id,
      nombre: 'Jane Doe',
      password: '5678',
      rol: 'admin',
    }); // Verifica que el servicio haya sido llamado con los parámetros correctos
    expect(component.successMessage).toBe('Usuario actualizado correctamente.'); // Verifica que el mensaje de éxito sea el esperado
  });

  it('should call deleteUser and update users list', () => {
    const user = { id: 1, nombre: 'John Doe', password: '1234', rol: 'admin' };
    spyOn(usuarioService, 'eliminarUsuario').and.callThrough(); // Espía la llamada al servicio
    spyOn(usuarioService, 'obtenerTodosLosUsuarios').and.returnValue(of([{ id: 1, nombre: 'Jane Doe', password: '5678', rol: 'admin' }])) // Simula la respuesta del servicio
    component.deleteUser(user); // Llama al método deleteUser

    expect(usuarioService.eliminarUsuario).toHaveBeenCalledWith(user.id); // Verifica que el servicio haya sido llamado con el id correcto
    expect(usuarioService.obtenerTodosLosUsuarios).toHaveBeenCalled(); // Verifica que el servicio haya sido llamado para obtener los usuarios
    expect(component.users.length).toBe(1); // Verifica que la lista de usuarios haya sido actualizada
    expect(component.users[0].nombre).toBe('Jane Doe'); // Verifica que el nombre del usuario en la lista sea el esperado
  });
});
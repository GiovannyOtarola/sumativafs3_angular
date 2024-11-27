import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionService } from '../services/session.service';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  users: Usuario[] = [];
  editUserForm: FormGroup;
  editingUser: Usuario  | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  
  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    // Inicialización del formulario de edición
    this.editUserForm = this.fb.group({
      nombre: ['', Validators.required],
      password: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Verificar si el usuario tiene permisos de administrador
    const currentUser  = this.sessionService.getLoggedInUser ();
    if (!this.sessionService.getSessionStatus() || !currentUser  || currentUser .rol !== 'admin') {
      this.router.navigate(['/login']); // Redirigir si no es administrador
      return;
    }

    // Obtener todos los usuarios
    this.usuarioService.obtenerTodosLosUsuarios().subscribe(users => {
      this.users = users;
    });
  }

  editUser (user: Usuario): void {
    // Rellenar el formulario con los datos del usuario
    this.editingUser  = user;
    this.editUserForm.patchValue({
      nombre: user.nombre,
      password: user.password,
      rol: user.rol
    });
  }

  updateUser (): void {
    if (this.editUserForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    if (this.editingUser ) {
      const updatedUser: Usuario  = {
        ...this.editingUser ,
        ...this.editUserForm.value
      };

      this.usuarioService.actualizarUsuario(updatedUser.id!, updatedUser ).subscribe(response => {
        if (response) {
          this.successMessage = 'Usuario actualizado correctamente.';
          this.errorMessage = '';
          this.editingUser  = null;  // Limpiar la edición después de actualizar
          this.editUserForm.reset();

          // Actualizar la lista de usuarios
          this.usuarioService.obtenerTodosLosUsuarios().subscribe(users => {
            this.users = users;
          });
        } else {
          this.errorMessage = 'Error al actualizar el usuario';
        }
      });
    }
  }

  cancelEdit(): void {
    // Cancelar la edición y limpiar los mensajes
    this.editingUser  = null;
    this.successMessage = '';
    this.errorMessage = '';
    this.editUserForm.reset();
  }

  logout(): void {
    this.sessionService.logout(); // Cierra sesión en el servicio de sesión
    this.router.navigate(['/login']); // Redirige al login
  }

  deleteUser (user: Usuario): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(user.id!).subscribe({
        next: () => {
          this.successMessage = 'Usuario eliminado correctamente.';
          this.errorMessage = '';
  
          // Actualizar la lista de usuarios después de la eliminación
          this.usuarioService.obtenerTodosLosUsuarios().subscribe(users => {
            this.users = users;
          });
        },
        error: () => {
          this.errorMessage = 'Error al eliminar el usuario';
        }
      });
    }
  }
}
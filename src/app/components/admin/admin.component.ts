import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  editUserForm: FormGroup;
  editingUser: User | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private fb: FormBuilder) {
    // Inicialización del formulario de edición
    this.editUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Obtener todos los usuarios cuando se inicialice el componente
    this.authService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  editUser(user: User): void {
    // Rellenar el formulario con los datos del usuario
    this.editingUser = user;
    this.editUserForm.patchValue({
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role
    });
  }

  updateUser(): void {
    if (this.editUserForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    if (this.editingUser) {
      const updatedUser: User = {
        ...this.editingUser,
        ...this.editUserForm.value
      };

      this.authService.updateProfile(updatedUser).subscribe(response => {
        if (response.success) {
          this.successMessage = 'Usuario actualizado correctamente.';
          this.errorMessage = '';
          // Actualizar la lista de usuarios
          this.authService.getAllUsers().subscribe(users => {
            this.users = users;
          });
        } else {
          this.errorMessage = response.message || 'Error al actualizar el usuario';
        }
      });
    }
  }

  cancelEdit(): void {
    // Cancelar la edición y limpiar los mensajes
    this.editingUser = null;
    this.successMessage = '';
    this.errorMessage = '';
    this.editUserForm.reset();
  }
}
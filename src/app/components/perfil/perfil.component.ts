import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  user: User | null = null;
  editableUser: Partial<User> = {}; // Para almacenar los datos editables del usuario
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Suscribirse para obtener el usuario actual
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
        // Crear una copia del usuario para edición sin el campo "role"
        this.editableUser = {
          username: user.username,
          email: user.email,
          password: user.password // Si el usuario puede actualizar su contraseña
        };
      }
    });
  }

  saveChanges(): void {
    if (this.editableUser) {
      const updatedUser = {
        ...this.user,
        ...this.editableUser
      } as User;

      this.authService.updateProfile(updatedUser).subscribe(
        (response) => {
          if (response.success) {
            this.successMessage = 'Perfil actualizado correctamente.';
            this.errorMessage = '';
          } else {
            this.successMessage = '';
            this.errorMessage = response.message || 'Error al actualizar el perfil.';
          }
        },
        (error) => {
          this.successMessage = '';
          this.errorMessage = 'Ocurrió un error al actualizar el perfil.';
        }
      );
    }
  }
}
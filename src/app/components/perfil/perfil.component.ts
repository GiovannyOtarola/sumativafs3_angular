import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  user: User | null = null;
  editableUser: Partial<User> = {}; // Para almacenar los datos editables del usuario
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService,private router: Router,private sessionService: SessionService) {}

  ngOnInit(): void {
    // Obtener el usuario desde SessionService
    if (this.sessionService.getSessionStatus()) {
      this.user = this.sessionService.getLoggedInUser();
      if (this.user) {
        this.editableUser = {
          username: this.user.username,
          email: this.user.email,
          password: this.user.password // Si decides manejar contraseñas directamente
        };
      } else {
        this.router.navigate(['/login']); // Redirigir si no hay usuario logueado
      }
    } else {
      this.router.navigate(['/login']); // Redirigir si no hay sesión activa
    }
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

            // Actualizar el usuario en SessionService
            this.sessionService.login(updatedUser);
            this.user = updatedUser;
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

  redirectToPrincipal(): void {
    this.router.navigate(['/principal']);
  }
}
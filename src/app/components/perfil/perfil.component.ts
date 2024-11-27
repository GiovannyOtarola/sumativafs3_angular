import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../services/session.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  user: Usuario  | null = null;
  editableUser: Partial<Usuario > = {}; // Para almacenar los datos editables del usuario
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el usuario desde SessionService
    if (this.sessionService.getSessionStatus()) {
      const loggedInUser  = this.sessionService.getLoggedInUser ();
      if (loggedInUser ) {
        // Obtener el usuario completo desde el servicio
        this.usuarioService.obtenerUsuarioPorId(loggedInUser .id!).subscribe(
          (usuario) => {
            this.user = usuario;
            this.editableUser  = {
              nombre: this.user.nombre,
              password: this.user.password,
              rol: this.user.rol
            };
          },
          (error) => {
            this.router.navigate(['/login']); // Redirigir si hay un error al obtener el usuario
          }
        );
      } else {
        this.router.navigate(['/login']); // Redirigir si no hay usuario logueado
      }
    } else {
      this.router.navigate(['/login']); // Redirigir si no hay sesión activa
    }
  }

  saveChanges(): void {
    if (this.editableUser ) {
      // Actualizar el usuario en el servicio
      this.usuarioService.actualizarUsuario(this.user!.id!, this.editableUser  as Usuario).subscribe(
        (response) => {
          this.successMessage = 'Perfil actualizado correctamente.';
          this.errorMessage = '';

          // Actualizar el usuario en SessionService
          this.sessionService.login({ ...this.user, ...this.editableUser  });
          this.user = { ...this.user, ...this.editableUser  } as Usuario;
        },
        (error) => {
          this.successMessage = '';
          this.errorMessage = 'Error al actualizar el perfil.';
        }
      );
    }
  }

  redirectToPrincipal(): void {
    this.router.navigate(['/principal']);
  }
}
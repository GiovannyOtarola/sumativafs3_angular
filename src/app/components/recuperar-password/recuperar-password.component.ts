import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.css'
})
export class RecuperarPasswordComponent {
  recuperarForm: FormGroup;
  mensaje: string = '';

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder,private router: Router) {
    this.recuperarForm = this.fb.group({
      nombre: ['', [Validators.required]] 
    });
  }

  recuperarPassword(): void {
    const nombre = this.recuperarForm.value.nombre;

    this.usuarioService.obtenerUsuarioPorNombre(nombre).subscribe(
      (usuario: any) => {
        if (usuario) {
          // Si el usuario se encuentra, mostrar la contraseña
          this.mensaje = `Tu contraseña es: ${usuario.password}`; // Asegúrate de que esto sea seguro
        } else {
          // Si no se encuentra el usuario, mostrar un mensaje de error
          this.mensaje = 'No se encontró un usuario con ese nombre';
        }
      },
      (error) => {
        this.mensaje = 'Error de conexión o datos incorrectos. Inténtalo de nuevo.';
      }
    );
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}

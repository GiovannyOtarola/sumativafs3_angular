import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../services/session.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private sessionService: SessionService,
    private router: Router
  ) {
    // Inicializamos el formulario de inicio de sesión
    this.loginForm = this.fb.group({
      nombre: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Verificar si ya hay un usuario logueado
    const user = this.sessionService.getLoggedInUser ();
    if (user) {
      // Redirigir según el rol del usuario
      this.router.navigate([user.rol === 'admin' ? '/admin' : '/principal']);
    }
  }

  login(): void {
    const { nombre, password } = this.loginForm.value;
    this.usuarioService.login({ nombre, password }).subscribe(
      (response: any) => {
        if (response.message === "Inicio de sesión exitoso") {
          this.sessionService.login(response.usuario); // Guardar el usuario en la sesión
  
          // Verificar si el usuario está correctamente logueado
          if (this.sessionService.getSessionStatus()) {
            console.log('Usuario logueado correctamente:', this.sessionService.getLoggedInUser());
            // Redirigir según el rol del usuario
            this.router.navigate([response.usuario.rol === 'admin' ? '/admin' : '/principal']);
          } else {
            console.error('El usuario no está logueado correctamente.');
          }
        } else {
          this.errorMessage = response.message || 'Error al intentar iniciar sesión.';
        }
      },
      (error) => {
        this.errorMessage = 'Error de conexión o datos incorrectos. Inténtalo de nuevo.';
      }
    );
  }

  redirectToRegister(): void {
    this.router.navigate(['/registro']);
  }

  redirectToRecoverPassword(): void {
    this.router.navigate(['/recuperar']);
  }
}
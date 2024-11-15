import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder  // Inyectamos FormBuilder para crear el formulario
  ) {
    // Inicializamos loginForm
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Si ya hay un usuario logueado, redirige a la página correspondiente
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (user.role === 'user') {
          this.router.navigate(['/principal']);
        }
      }
    });
  }

  login(): void {
    const { email, password } = this.loginForm.value;
    this.authService.login({ email, password }).subscribe(
      (response: any) => {
        if (response.success) {
          this.authService.getCurrentUser().subscribe((user) => {
            if (user) {
              if (user.role === 'admin') {
                this.router.navigate(['/admin']);
              } else if (user.role === 'user') {
                this.router.navigate(['/principal']);
              } else {
                this.errorMessage = 'El usuario no tiene un rol asignado.';
              }
            } else {
              this.errorMessage = 'Usuario no encontrado.';
            }
          });
        } else {
          this.errorMessage = response.message || 'Error al intentar iniciar sesión.';
        }
      },
      (error) => {
        this.errorMessage = 'Error de conexión o datos incorrectos. Inténtalo de nuevo.';
      }
    );
  }
}
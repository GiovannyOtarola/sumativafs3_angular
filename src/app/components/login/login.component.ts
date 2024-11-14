import { Component } from '@angular/core';
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
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            const userRole = response.user.role; // Obtener el rol del usuario

            // Redirigir según el rol del usuario
            if (userRole === 'admin') {
              this.router.navigate(['/admin']);
            } else if (userRole === 'user') {
              this.router.navigate(['/principal']);
            }
          } else {
            this.errorMessage = response.message || 'Credenciales incorrectas';
          }
        },
        error: () => {
          this.errorMessage = 'Error en el inicio de sesión';
        }
      });
    }
  }
}
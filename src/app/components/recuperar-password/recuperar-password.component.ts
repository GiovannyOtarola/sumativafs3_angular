import { Component } from '@angular/core';
import { AuthService, User } from '../services/auth.service';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private authService: AuthService, private fb: FormBuilder,private router: Router) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  recuperarPassword(): void {
    const email = this.recuperarForm.value.email;

    this.authService.getUserByEmail(email).subscribe((user: User | null) => {
      if (user) {
        // Si el usuario se encuentra, mostrar la contraseña
        this.mensaje = `Tu contraseña es: ${user.password}`;
      } else {
        // Si no se encuentra el usuario, mostrar un mensaje de error
        this.mensaje = 'No se encontró un usuario con ese email';
      }
    });
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}

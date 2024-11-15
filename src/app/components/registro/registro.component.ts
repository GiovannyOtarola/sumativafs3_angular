import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators,AbstractControl , ValidationErrors, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})

export class RegistroComponent {
  registerForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]], // Validación personalizada de contraseña
      role: ['user']
    });
  }

  // Método de validación de contraseña personalizada
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    const hasMinLength = value.length >= 4;
    const hasMaxLength = value.length <= 20;
    const hasSpecialChar = /[!&#64;#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    const hasNumber = /\d/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);

    const passwordValid = hasMinLength && hasMaxLength && hasSpecialChar && hasNumber && hasLetter;

    return passwordValid ? null : {
      passwordStrength: {
        hasMinLength,
        hasMaxLength,
        hasSpecialChar,
        hasNumber,
        hasLetter
      }
    };
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Registro exitoso!';
            this.errorMessage = null;
            this.registerForm.reset();
          }
        },
        error: () => {
          this.successMessage = null;
          this.errorMessage = 'Error en el registro';
        }
      });
    }
  }
}

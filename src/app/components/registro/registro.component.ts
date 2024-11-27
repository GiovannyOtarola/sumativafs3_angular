import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,AbstractControl , ValidationErrors, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../services/usuario.service'; // Importa el servicio de usuario
import { Usuario } from '../../models/usuario.model'; // Importa el modelo de usuario

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'] // Corrige 'styleUrl' a 'styleUrls'
})
export class RegistroComponent {
  registerForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required], // Cambia 'username' a 'nombre'
      password: ['', [Validators.required, this.passwordValidator]], // Validación personalizada de contraseña
      rol: ['user'] // Cambia 'role' a 'rol'
    });
  }

  // Método de validación de contraseña personalizada
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    const hasMinLength = value.length >= 4;
    const hasMaxLength = value.length <= 20;
    const hasSpecialChar = /[!&@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
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
      const usuario: Usuario = {
        ...this.registerForm.value, // Propiedades de nombre y password
        rol: 'user' // Establecer el rol por defecto
      };
      this.usuarioService.crearUsuario(usuario).subscribe({
        next: (response) => {
          this.successMessage = 'Registro exitoso!';
          this.errorMessage = null;
          this.registerForm.reset();
  
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: () => {
          this.successMessage = null;
          this.errorMessage = 'Error en el registro';
        }
      });
    }
  }
}
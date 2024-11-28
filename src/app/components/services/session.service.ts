import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * @description
 * Servicio para gestionar la sesion del usuario.
 * 
 * Este servicio permite iniciar sesión, cerrar sesion y obtener el estado actual de la sesion y el usuario logueado.
 */
 
@Injectable({
  providedIn: 'root'
})
export class SessionService {
    private isLoggedIn: boolean = false;
    private loggedInUser: any = null;
  
    constructor() {
      // Verificar si ya hay un usuario logueado en el localStorage al iniciar
      const storedUser = localStorage.getItem('loggedInUser');
      if (storedUser) {
        this.loggedInUser = JSON.parse(storedUser);
        console.log('Usuario cargado desde localStorage:', this.loggedInUser);
        this.isLoggedIn = true;  // Si hay un usuario guardado, marcar como logueado
      }
    }
  
    login(user: any): void {
      this.isLoggedIn = true;
      this.loggedInUser = user;
      console.log('Guardando usuario en localStorage:', user);
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    }
  
    logout(): void {
      this.isLoggedIn = false;
      this.loggedInUser = null;
      localStorage.removeItem('loggedInUser');
    }
  
    getSessionStatus(): boolean {
      console.log('Estado de sesión:', this.isLoggedIn);
      return this.isLoggedIn;
    }
  
    getLoggedInUser(): any {
      console.log('Obteniendo usuario logueado:', this.loggedInUser);
      return this.loggedInUser;
    }

    
  }
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
    username: string;
    email: string;
    password: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private users: User[] = this.loadUsersFromLocalStorage();  // Cargar usuarios desde LocalStorage si existen
    private current: User | null = null;
    private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  
    constructor() {
      // Verificar si ya existe un usuario logueado
      const loggedInUser = localStorage.getItem('currentUser');
      if (loggedInUser) {
        this.current = JSON.parse(loggedInUser);  // Cargar el usuario logueado desde LocalStorage
        this.currentUserSubject.next(this.current);  // Actualizar el BehaviorSubject
      }
  
      // Si no hay un usuario admin en el localStorage, lo agregamos
      if (!this.users.some(user => user.role === 'admin')) {
        const defaultAdmin: User = {
          username: 'admin',
          email: 'admin@gmail.com',
          password: 'admin123',
          role: 'admin',
        };
        this.users.push(defaultAdmin);
        this.saveUsersToLocalStorage();
      }
    }
  
    private loadUsersFromLocalStorage(): User[] {
      const users = localStorage.getItem('users');
      return users ? JSON.parse(users) : [];  // Si existen usuarios en LocalStorage, los carga; si no, retorna un arreglo vacío
    }
  
    private saveUsersToLocalStorage(): void {
      localStorage.setItem('users', JSON.stringify(this.users));  // Guarda el arreglo de usuarios en LocalStorage
    }
  
    register(user: User): Observable<any> {
      this.users.push(user);  // Agregar el nuevo usuario al arreglo
      this.saveUsersToLocalStorage();  // Guardar los usuarios actualizados en LocalStorage
      return of({ success: true }).pipe(delay(1000));
    }
  
    login(credentials: { email: string; password: string }): Observable<any> {
      const user = this.users.find(u => u.email === credentials.email && u.password === credentials.password);
      if (user) {
        this.current = user;
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));  // Guardar el usuario logueado en localStorage
        return of({ success: true }).pipe(delay(1000));
      }
      return of({ success: false, message: 'Credenciales incorrectas' }).pipe(delay(1000));
    }
  
    recoverPassword(email: string): Observable<any> {
      const user = this.users.find(u => u.email === email);
      if (user) {
        return of({ success: true }).pipe(delay(1000));
      }
      return of({ success: false, message: 'Email no encontrado' }).pipe(delay(1000));
    }
  
    updateProfile(updated: User): Observable<any> {
      const index = this.users.findIndex(u => u.email === updated.email);
      if (index !== -1) {
        this.users[index] = updated;
        this.current = updated;
        this.currentUserSubject.next(updated);
        this.saveUsersToLocalStorage();  // Guardar cambios en LocalStorage
        return of({ success: true }).pipe(delay(1000));
      }
      return of({ success: false, message: 'Usuario no encontrado' }).pipe(delay(1000));
    }
  
    getCurrentUser(): Observable<User | null> {
      return this.currentUserSubject.asObservable();
    }
  
    getUserByEmail(email: string): Observable<User | null> {
      const user = this.users.find(u => u.email === email);
      return of(user || null);
    }
  
    // Obtener todos los usuarios
    getAllUsers(): Observable<User[]> {
      return of(this.users);
    }

    deleteUser(user: User): Observable<any> {
        const index = this.users.findIndex(u => u.email === user.email);
        if (index !== -1) {
          this.users.splice(index, 1); // Eliminar el usuario
          this.saveUsersToLocalStorage(); // Guardar los usuarios actualizados en LocalStorage
          this.currentUserSubject.next(this.current); // Actualizar el usuario actual si es necesario
          return of({ success: true }).pipe(delay(1000));
        }
        return of({ success: false, message: 'Usuario no encontrado' }).pipe(delay(1000));
      }
  }
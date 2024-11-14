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
    private users: User[] = [
        {
            username: 'admin',
            email: 'admin@gmail.com',
            password: 'admin123',
            role: 'admin'
        }
    ]; // Usuario admin local predefinido
    private current: User | null = null; // Inicializado como null
    private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null); // Corregido el nombre y tipo

    constructor() {}

    register(user: User): Observable<any> {
        this.users.push(user);
        return of({ success: true }).pipe(delay(1000));
    }

    login(credentials: { email: string; password: string }): Observable<any> {
        const user = this.users.find(u => u.email === credentials.email && u.password === credentials.password);
        if (user) {
            this.current = user; // Asignar el usuario actual
            this.currentUserSubject.next(user); // Emitir el usuario actual
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
            this.current = updated; // Actualizar el usuario actual
            this.currentUserSubject.next(updated); // Emitir el usuario actualizado
            return of({ success: true }).pipe(delay(1000));
        }
        return of({ success: false, message: 'Usuario no encontrado' }).pipe(delay(1000));
    }

    getCurrentUser(): Observable<User | null> {
        return this.currentUserSubject.asObservable(); // Retornar el observable de usuario actual
    }

    getUserByEmail(email: string): Observable<User | null> {
        const user = this.users.find(u => u.email === email);
        return of(user || null);
    }

    // Obtener todos los usuarios
    getAllUsers(): Observable<User[]> {
        return of(this.users); // Retorna todos los usuarios almacenados en el arreglo
    }
}
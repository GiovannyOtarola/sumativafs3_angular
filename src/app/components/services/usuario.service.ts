import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario, UsuarioDTO } from '../../models/usuario.model'; 
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/api/usuarios';
  private apiUrl = 'http://localhost:8080/api/login';
  private credentials: { nombre: string; password: string } | null = null;

  constructor(private http: HttpClient,private sessionService: SessionService) {}

  private getAuthHeaders(): HttpHeaders {
    const loggedInUser = this.sessionService.getLoggedInUser();
    if (!loggedInUser) {
      throw new Error('No hay usuario logueado.');
    }
    const { nombre, password } = loggedInUser; // Asumimos que el objeto de usuario tiene estas credenciales.
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${nombre}:${password}`),
    });
  }


  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario, { headers: this.getAuthHeaders() });
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  obtenerTodosLosUsuarios(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  // Realizar el login y gestionar la sesión
  login(credentials: { nombre: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap((response) => {
        // Suponiendo que el backend devuelve un objeto de usuario completo
        const user = response.user;
        this.sessionService.login(user);
      })
    );
  }

  obtenerUsuarioPorNombre(nombre: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/nombre/${nombre}`);
  }
}
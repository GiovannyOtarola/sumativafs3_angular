import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, UsuarioDTO } from '../../models/usuario.model'; 

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/api/usuarios'; // Cambia el puerto si es necesario
  private apiUrl = 'http://localhost:8080/api/login';

  constructor(private http: HttpClient) {}

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  obtenerTodosLosUsuarios(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.baseUrl);
  }

  login(credentials: { nombre: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }

  // Método para obtener usuario por nombre
  obtenerUsuarioPorNombre(nombre: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/nombre/${nombre}`); // Asegúrate de que esta ruta exista en tu backend
  }
}
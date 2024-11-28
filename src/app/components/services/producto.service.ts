import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Producto, ProductoDTO } from '../../models/producto.model'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from './usuario.service';



@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient, private usuarioService: UsuarioService) {}

  private getAuthHeaders(): HttpHeaders {
    return this.usuarioService['getAuthHeaders']();
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, producto, { headers: this.getAuthHeaders() });
  }

  obtenerProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${id}`, producto, { headers: this.getAuthHeaders() });
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  obtenerTodosLosProductos(): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }
}
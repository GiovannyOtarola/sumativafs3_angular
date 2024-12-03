import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../../models/compra.model';
import { UsuarioService } from './usuario.service'; // Asegúrate de importar el servicio de usuario

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private baseUrl = 'http://localhost:8080/api/compras'; // Cambia esto si tu backend tiene otra URL

  constructor(private http: HttpClient, private usuarioService: UsuarioService) {}
  
  private getAuthHeaders(): HttpHeaders {
    return this.usuarioService['getAuthHeaders']();
  }

  realizarCompra(compra: Compra): Observable<Compra> {
    return this.http.post<Compra>(this.baseUrl, compra, {
      headers: this.getAuthHeaders() 
    });
  }
}
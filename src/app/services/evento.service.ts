import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Evento } from '../models/evento';
import { Usuario } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return headers;
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario`, { headers: this.getHeaders() });
  }

  getEstados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estado-eventos`, { headers: this.getHeaders() });
  }

  getUbicaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ubicaciones`, { headers: this.getHeaders() });
  }

  crearEvento(evento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/eventos`, evento, { headers: this.getHeaders() });
  }

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/eventos`, { headers: this.getHeaders() });
  }

  actualizarEstadoEvento(payload: { idEvento: string, estado: { idEstadoEvento: string } }): Observable<any> {
    // El backend espera PUT a /eventos/estado/{idEvento} con el body { idEstadoEvento: ... }
    return this.http.put(`${this.apiUrl}/eventos/estado/${payload.idEvento}`, { idEstadoEvento: payload.estado.idEstadoEvento }, { headers: this.getHeaders() });
  }

  // Método para obtener eventos por organizador
  getEventosByOrganizador(organizador: Usuario): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/eventos/organizador/${organizador.idUsuario}`, { headers: this.getHeaders() });
  }
}

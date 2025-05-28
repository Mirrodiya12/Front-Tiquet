import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario`);
  }

  getEstados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estado-eventos`);
  }

  getUbicaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ubicaciones`);
  }

  crearEvento(evento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/eventos`, evento);
  }
}

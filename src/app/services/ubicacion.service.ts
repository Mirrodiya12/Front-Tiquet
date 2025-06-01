import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private apiUrl = '/api/ubicaciones'; // Endpoint específico para ubicaciones

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      // Dependiendo de la lógica de tu app, podrías redirigir al login aquí
      // o simplemente lanzar un error que el componente maneje.
      console.error('No hay token de autenticación.');
      // Considerar lanzar un error o devolver un observable de error
      // throw new Error('No hay token de autenticación');
    }
    // Si no hay token, enviamos headers sin Authorization. El interceptor debería manejar el 401/403.
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getUbicaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getUbicacionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createUbicacion(ubicacion: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ubicacion, { headers: this.getHeaders() });
  }

  updateUbicacion(id: string, ubicacion: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, ubicacion, { headers: this.getHeaders() });
  }

  deleteUbicacion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Puedes añadir un método para obtener ubicaciones por ID de usuario si es necesario,
  // similar a como lo hiciste en EventoService, si tu backend soporta esa ruta.
} 
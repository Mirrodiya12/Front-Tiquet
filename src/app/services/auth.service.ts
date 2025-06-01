import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { Usuario } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(correo: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { correo, contrasena }).pipe(
      tap(response => {
        if (response.token && response.usuario) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
        }
      }),
      catchError(error => {
        throw error; // Re-lanzar el error para que el componente lo maneje
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
    }
    return token;
  }

  getUsuario(): Usuario | null {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr);
        return usuario;
      } catch (error) {
        console.error('Error al parsear usuario de localStorage:', error);
        return null;
      }
    }
    return null;
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuario`, userData);
  }
}
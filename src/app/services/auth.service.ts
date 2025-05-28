import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuario/login';
  private usuario: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post(this.apiUrl, { correo, contrasena }).pipe(
      tap((user) => {
        this.usuario = user;
      })
    );
  }

  getUsuario() {
    return this.usuario;
  }

  logout() {
    this.usuario = null;
    this.router.navigate(['/login']);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/rol');
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/usuario', userData);
  }
}

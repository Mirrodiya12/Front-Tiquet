import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/rol`);
  }

  registerUser(userData: {
    nombre: string,
    correo: string,
    contrasena: string,
    rol: { idRol: string }
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuario`, userData);
  }
  
} 
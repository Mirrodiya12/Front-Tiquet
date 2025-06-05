import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // No interceptar peticiones de autenticación
    if (req.url.includes('/api/auth/')) {
      return next.handle(req);
    }

    const token = this.authService.getToken();
    if (!token) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return throwError(() => new Error('No hay token de autenticación'));
    }

    // Clonar la petición y agregar el header de autorización
    const authReq = req.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          console.error('Error de permisos:', error.error);
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => new Error('No tiene permisos para realizar esta acción'));
        }
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => new Error('Sesión expirada'));
        }
        return throwError(() => error);
      })
    );
  }
}

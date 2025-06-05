import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Categoria } from '../interfaces/categoria.interface';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    if (!token) {
      // Manejar la ausencia de token, por ejemplo, redirigir al login
      console.error('No hay token de autenticación disponible.');
      // Dependiendo de tu lógica de auth, podrías lanzar un error o redirigir
      throw new Error('No authentication token available.');
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
    return httpOptions;
  }

  obtenerCategorias(): Observable<Categoria[]> {
    // console.log(`GET ${this.apiUrl}`);
    return this.http.get<Categoria[]>(this.apiUrl, this.getHttpOptions()).pipe(
      map(response => {
        // console.log('Respuesta del servidor:', response);
        // Asegurarse de que cada categoría tenga el idEvento correctamente asignado
        return response.map(cat => {
          // Si el idEvento está en el objeto evento pero no en la raíz, copiarlo
          if (!cat.idEvento && cat.evento && cat.evento.idEvento) {
            cat.idEvento = cat.evento.idEvento;
          }
          return cat;
        });
      }),
      catchError(error => {
        console.error('Error en obtenerCategorias:', error);
        if (error.status === 401) {
          console.error('Error de autenticación');
          this.authService.logout();
        }
        return throwError(() => new Error('Error al obtener las categorías'));
      })
    );
  }

  crearCategoria(categoria: Categoria): Observable<Categoria> {
    // console.log(`POST ${this.apiUrl}`, categoria);

    // Construir el objeto a enviar al backend explícitamente
    const categoriaParaEnviar: any = { // Usamos any temporalmente para flexibilidad con campos opcionales
        nombre: categoria.nombre,
        precio: categoria.precio,
        stock: categoria.stock,
        fechaExpira: categoria.fechaExpira
    };

    // Si el backend espera el idEvento dentro de un objeto evento anidado
     if (categoria.idEvento) {
       categoriaParaEnviar.evento = { idEvento: categoria.idEvento };
       // No necesitamos eliminar el idEvento plano si no lo añadimos inicialmente
     }

    return this.http.post<Categoria>(this.apiUrl, categoriaParaEnviar, this.getHttpOptions()).pipe(
      catchError(error => {
        console.error('Error en crearCategoria:', error);
         if (error.status === 403) {
            return throwError(() => new Error('No tiene permisos para crear categorías'));
         }
        return throwError(() => new Error(error.error?.message || 'Error al crear la categoría'));
      })
    );
  }

  actualizarCategoria(id: string, categoria: Categoria): Observable<Categoria> {
     // console.log(`PUT ${this.apiUrl}/${id}`, categoria);

     // Construir el objeto a enviar al backend explícitamente
     const categoriaParaEnviar: any = { // Usamos any temporalmente
         idCategoria: categoria.idCategoria, // Incluir ID para actualizar
         nombre: categoria.nombre,
         precio: categoria.precio,
         stock: categoria.stock,
         fechaExpira: categoria.fechaExpira
     };

     if (categoria.idEvento) {
       categoriaParaEnviar.evento = { idEvento: categoria.idEvento };
       // No necesitamos eliminar el idEvento plano
     }

    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoriaParaEnviar, this.getHttpOptions()).pipe(
      catchError(error => {
        console.error(`Error en actualizarCategoria ${id}:`, error);
        return throwError(() => new Error('Error al actualizar la categoría'));
      })
    );
  }

  eliminarCategoria(id: string): Observable<void> {
     // console.log(`DELETE ${this.apiUrl}/${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      catchError(error => {
        console.error(`Error en eliminarCategoria ${id}:`, error);
        return throwError(() => new Error('Error al eliminar la categoría'));
      })
    );
  }

  consultarPorEvento(eventoId: string): Observable<CategoriaDomain | null> {
    // console.log(`POST ${this.apiUrl}/evento`, { idEvento: eventoId });
     // El backend espera un RequestBody con un objeto EventoDomain que contenga solo el idEvento
    const body = { idEvento: eventoId };
    // Usamos post porque el backend espera un RequestBody
    return this.http.post<CategoriaDomain>(`${this.apiUrl}/evento`, body, this.getHttpOptions()).pipe(
      // El endpoint devuelve 404 si no encuentra la categoría, manejamos eso para devolver null
      catchError(error => {
         if (error.status === 404) {
           console.warn(`No se encontró categoría para el evento ${eventoId}`);
           // Retornar un observable que emite null y luego completa para indicar que no hay categoría
           return of(null);
         }
        console.error(`Error en consultarPorEvento ${eventoId}:`, error);
        return throwError(() => new Error('Error al consultar la categoría por evento'));
      })
    );
  }
}

// Interface dummy para que compile el servicio con el nuevo método
// Reemplazar con la interface real si EventoDomain tiene más propiedades relevantes para el frontend
interface EventoDomain {
  idEvento: string;
  // Añadir otras propiedades de Evento si son necesarias en el frontend
}

// Interface dummy para CategoriaDomain, si es diferente de Categoria
// Ajustar si CategoriaDomain tiene propiedades distintas o adicionales que uses en el frontend
interface CategoriaDomain extends Categoria {
  // Añadir otras propiedades si CategoriaDomain tiene más que Categoria
}

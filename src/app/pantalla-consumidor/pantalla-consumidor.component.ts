import { Component, OnInit } from '@angular/core';
import { Evento } from '../models/evento';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-listar-eventos',
  templateUrl: './pantalla-consumidor.component.html',
  styleUrls: ['./pantalla-consumidor.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PantallaConsumidorComponent implements OnInit {
  eventos: Evento[] = [];
  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
    // private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.obtenerEventos();
  }

  obtenerEventos(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    this.http.get<Evento[]>(`/api/eventos`, { headers }).subscribe({
      next: (data: Evento[]) => {
        this.eventos = data;
        this.error = null;
      },
      error: (err: any) => {
        if (err.status === 403 || err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.error = 'Error al cargar los eventos. Por favor, intente nuevamente.';
        }
      }
    });
  }

  eventoExpandido: Evento | null = null;

  toggleEvento(evento: Evento): void {
    this.eventoExpandido = this.eventoExpandido === evento ? null : evento;
  }

  // Método para volver (puede navegar a una página anterior o una por defecto)
  volver(): void {
    // Para el consumidor, podrías redirigir a una página de inicio o al dashboard si existiera
    console.log('Botón Volver presionado en Pantalla Consumidor. No hay navegación definida.');
    // this.router.navigate(['/dashboard-consumidor']); // Ejemplo si tuvieras dashboard
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
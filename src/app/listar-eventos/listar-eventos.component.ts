import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Evento } from '../models/evento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/usuario';
import { EventoService } from '../services/evento.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-listar-eventos',
  templateUrl: './listar-eventos.component.html',
  styleUrls: ['./listar-eventos.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
})
export class ListarEventosComponent implements OnInit {
  eventos: Evento[] = [];
  usuario: Usuario | null = null;
  error: string | null = null;
  estados: any[] = []; // Lista de estados disponibles
  eventoEditandoEstado: any | null = null; // Para saber qué evento estamos editando
  nuevoEstadoSeleccionado: string = ''; // Para almacenar el ID del nuevo estado seleccionado

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.obtenerEventos();
    this.cargarEstados(); // Cargar la lista de estados al iniciar
  }

  obtenerEventos(): void {
    if (!this.usuario) {
      return;
    }
  
    this.eventoService.getEventosByOrganizador(this.usuario).subscribe({
      next: (data) => {
        this.eventos = data;
        this.error = null;
      },
      error: (error) => {
        if (error.status === 403 || error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.error = 'Error al cargar tus eventos. Por favor, intente nuevamente.';
        }
      }
    });
  }
  

  eventoExpandido: any = null;

  toggleEvento(evento: any) {
    this.eventoExpandido = this.eventoExpandido === evento ? null : evento;
  }

  irCrearEvento() {
    this.router.navigate(['/crear-evento']);
  }

  cargarEstados(): void {
    this.eventoService.getEstados().subscribe({
      next: (data) => {
        this.estados = data;
      },
      error: (err) => console.error('Error al cargar estados:', err)
    });
  }

  iniciarEdicionEstado(evento: any): void {
    this.eventoEditandoEstado = evento;
    this.nuevoEstadoSeleccionado = evento.estado?.idEstadoEvento || '';
  }

  cancelarEdicionEstado(): void {
    this.eventoEditandoEstado = null;
    this.nuevoEstadoSeleccionado = '';
  }

  guardarEstado(): void {
    if (!this.eventoEditandoEstado || !this.nuevoEstadoSeleccionado) {
      return;
    }

    const payload = {
      idEvento: this.eventoEditandoEstado.idEvento,
      estado: { idEstadoEvento: this.nuevoEstadoSeleccionado }
    };

    this.eventoService.actualizarEstadoEvento(payload).subscribe({
      next: (response) => {
        const index = this.eventos.findIndex(e => e.idEvento === this.eventoEditandoEstado.idEvento);
        if (index !== -1) {
          this.eventos[index].estado = response.estado;
        }
        this.cancelarEdicionEstado();
        alert('Estado del evento actualizado.');
        this.obtenerEventos();
      },
      error: (err) => {
        this.error = 'Error al actualizar el estado del evento. Por favor, intente nuevamente más tarde.';
      }
    });
  }

  // Método para volver (puede navegar a una página anterior o una por defecto)
  volver(): void {
    // Por simplicidad, aquí navegamos a una página por defecto, podrías implementar historial si es necesario
    const usuarioActual = this.authService.getUsuario();
    const rol = usuarioActual?.rol?.nombre?.toLowerCase();

    if (rol === 'organizador') {
      // Si eres organizador, no hay 'atrás' per se desde listar eventos, podrías ir al dashboard si tuvieras uno
      // Por ahora, no hacemos nada o podrías redirigir a otro lado si aplica.
      console.log('Botón Volver presionado en Listar Eventos (Organizador). No hay navegación definida.');
      // this.router.navigate(['/dashboard-organizador']); // Ejemplo si tuvieras dashboard
    } else if (rol === 'consumidor') {
       // Esto no debería ocurrir aquí si solo los organizadores listan eventos, pero por si acaso.
      this.router.navigate(['/pantalla-consumidor']);
    } else {
        this.router.navigate(['/login']);
    }
  }

  // Método para cerrar sesión (este ya no es necesario si usas la navbar)
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irACrearCategoria(evento: Evento): void {
    this.router.navigate(['/categorias', evento.idEvento]);
  }
}

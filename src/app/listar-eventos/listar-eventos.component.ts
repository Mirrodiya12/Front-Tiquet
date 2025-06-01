import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Evento } from '../models/evento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';  // Importa Router
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/usuario';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-listar-eventos',
  templateUrl: './listar-eventos.component.html',
  styleUrls: ['./listar-eventos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout(); // Llama al método de logout del servicio
    this.router.navigate(['/login']); // Redirige a la página de login
  }
}

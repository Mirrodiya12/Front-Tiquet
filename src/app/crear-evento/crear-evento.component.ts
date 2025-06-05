import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../services/evento.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UbicacionService } from '../services/ubicacion.service';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CrearEventoComponent implements OnInit {
  ubicaciones: any[] = [];
  error: string | null = null;

  evento = {
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    tipoEvento: '',
    stockGeneral: 0,
    estado: { idEstadoEvento: '' },
    ubicacion: { idUbicacion: '' }
  };

  nuevaUbicacion = {
    ciudad: '',
    departamento: '',
    direccion: '',
    pais: ''
  };

  constructor(
    private eventoService: EventoService, 
    private router: Router,
    private authService: AuthService,
    private ubicacionService: UbicacionService
  ) {}

  ngOnInit(): void {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarEstados();
  }

  private cargarEstados(): void {
    this.eventoService.getEstados().subscribe({
      next: (data) => {
        const estadoPlaneado = data.find((e: any) => e.nombre === 'Planeado'); 
        if (estadoPlaneado) {
          this.evento.estado.idEstadoEvento = estadoPlaneado.idEstadoEvento;
        } else {
          this.error = 'No se pudo encontrar el estado por defecto (planeado).';
        }
      },
      error: (err) => this.manejarError(err)
    });
  }

  private validarEvento(): boolean {
    if (!this.evento.nombre || !this.evento.descripcion || !this.evento.fechaInicio || 
        !this.evento.fechaFin || !this.evento.tipoEvento || 
        !this.evento.estado.idEstadoEvento ||
        !this.nuevaUbicacion.ciudad || !this.nuevaUbicacion.departamento || 
        !this.nuevaUbicacion.direccion || !this.nuevaUbicacion.pais) {
      this.error = 'Todos los campos del evento y de la ubicación son obligatorios.';
      return false;
    }

    const fechaInicio = new Date(this.evento.fechaInicio);
    const fechaFin = new Date(this.evento.fechaFin);
    
    if (fechaInicio >= fechaFin) {
      this.error = 'La fecha de inicio debe ser anterior a la fecha de fin';
      return false;
    }

    return true;
  }

  private manejarError(error: any): void {
    if (error.status === 403 || error.status === 401) {
      this.authService.logout();
      this.router.navigate(['/login']);
    } else if (error.status === 400) {
      this.error = error.error?.message || 'Error en los datos. Por favor, verifique los campos.';
    } else {
      this.error = 'Error al procesar la solicitud. Por favor, intente nuevamente.';
    }
  }

  crearEvento(): void {
    this.error = null;
    
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.validarEvento()) {
      return;
    }

    const usuarioActual = this.authService.getUsuario();
    if (!usuarioActual || !usuarioActual.idUsuario) {
      this.error = 'No se pudo determinar el organizador. Intente iniciar sesión nuevamente.';
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.ubicacionService.createUbicacion(this.nuevaUbicacion).subscribe({
      next: (ubicacionCreada) => {
        this.evento.ubicacion.idUbicacion = ubicacionCreada.idUbicacion;

        const eventoPayload = {
          ...this.evento,
          stockGeneral: 0,
          organizador: { idUsuario: usuarioActual.idUsuario },
          estado: this.evento.estado 
        };

        this.eventoService.crearEvento(eventoPayload).subscribe({
          next: () => {
            alert('Evento creado correctamente');
            this.router.navigate(['/eventos']);
          },
          error: (err) => { 
            this.manejarError(err);
          }
        });

      },
      error: (err) => {
        this.manejarError(err);
      }
    });
  }

  volverAListarEventos(): void {
    this.router.navigate(['/eventos']);
  }

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout(); // Llama al método de logout del servicio
    this.router.navigate(['/login']); // Redirige a la página de login
  }
}
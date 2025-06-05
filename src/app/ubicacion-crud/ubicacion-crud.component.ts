import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UbicacionService } from '../services/ubicacion.service';

@Component({
  selector: 'app-ubicacion-crud',
  templateUrl: './ubicacion-crud.component.html',
  styleUrls: ['./ubicacion-crud.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UbicacionCrudComponent implements OnInit {
  ubicaciones: any[] = [];
  nuevaUbicacion: any = {
    direccion: '',
    ciudad: '',
    pais: ''
  };
  ubicacionEditando: any = null;
  error: string | null = null;

  constructor(
    private ubicacionService: UbicacionService,
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarUbicaciones();
  }

  cargarUbicaciones(): void {
    this.ubicacionService.getUbicaciones().subscribe({
      next: (data) => {
        this.ubicaciones = data;
      },
      error: (err) => this.manejarError(err)
    });
  }

  crearUbicacion(): void {
    if (!this.validarUbicacion(this.nuevaUbicacion)) {
      return;
    }

    this.ubicacionService.createUbicacion(this.nuevaUbicacion).subscribe({
      next: () => {
        this.cargarUbicaciones();
        this.nuevaUbicacion = { direccion: '', ciudad: '', pais: '' };
      },
      error: (err) => this.manejarError(err)
    });
  }

  actualizarUbicacion(): void {
    if (!this.ubicacionEditando || !this.validarUbicacion(this.ubicacionEditando)) {
      return;
    }

    this.ubicacionService.updateUbicacion(this.ubicacionEditando.idUbicacion, this.ubicacionEditando).subscribe({
      next: () => {
        this.cargarUbicaciones();
        this.ubicacionEditando = null;
      },
      error: (err) => this.manejarError(err)
    });
  }

  eliminarUbicacion(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) {
      this.ubicacionService.deleteUbicacion(id).subscribe({
        next: () => {
          this.cargarUbicaciones();
        },
        error: (err) => this.manejarError(err)
      });
    }
  }

  iniciarEdicion(ubicacion: any): void {
    this.ubicacionEditando = { ...ubicacion };
  }

  cancelarEdicion(): void {
    this.ubicacionEditando = null;
  }

  volverAEventos(): void {
    this.router.navigate(['/eventos']);
  }

  private validarUbicacion(ubicacion: any): boolean {
    if (!ubicacion.direccion || !ubicacion.ciudad || !ubicacion.pais) {
      this.error = 'Todos los campos son requeridos';
      return false;
    }
    this.error = null;
    return true;
  }

  private manejarError(error: any): void {
    if (error.status === 403 || error.status === 401) {
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      this.error = error.error?.message || 'Ocurrió un error. Por favor, intente nuevamente.';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 
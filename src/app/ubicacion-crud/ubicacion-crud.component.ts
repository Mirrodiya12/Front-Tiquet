import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UbicacionService } from '../services/ubicacion.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubicacion-crud',
  templateUrl: './ubicacion-crud.component.html',
  styleUrls: ['./ubicacion-crud.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UbicacionCrudComponent implements OnInit {
  ubicaciones: any[] = [];
  nuevaUbicacion: any = { ciudad: '', departamento: '', direccion: '', pais: '' };
  ubicacionEditando: any | null = null;
  error: string | null = null;

  constructor(
    private ubicacionService: UbicacionService,
    private authService: AuthService,
    private router: Router
  ) { }

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
      this.error = 'Por favor, completa todos los campos para crear una ubicación.';
      return;
    }

    this.ubicacionService.createUbicacion(this.nuevaUbicacion).subscribe({
      next: (ubicacionCreada) => {
        this.ubicaciones.push(ubicacionCreada);
        this.nuevaUbicacion = { ciudad: '', departamento: '', direccion: '', pais: '' };
        this.error = null;
      },
      error: (err) => this.manejarError(err)
    });
  }

  iniciarEdicion(ubicacion: any): void {
    this.ubicacionEditando = { ...ubicacion };
  }

  guardarEdicion(): void {
    if (!this.ubicacionEditando || !this.validarUbicacion(this.ubicacionEditando)) {
      this.error = 'Por favor, completa todos los campos para actualizar la ubicación.';
      return;
    }

    this.ubicacionService.updateUbicacion(this.ubicacionEditando.idUbicacion, this.ubicacionEditando).subscribe({
      next: (ubicacionActualizada) => {
        const index = this.ubicaciones.findIndex(u => u.idUbicacion === ubicacionActualizada.idUbicacion);
        if (index !== -1) {
          this.ubicaciones[index] = ubicacionActualizada;
        }
        this.cancelarEdicion();
        this.error = null;
      },
      error: (err) => this.manejarError(err)
    });
  }

  cancelarEdicion(): void {
    this.ubicacionEditando = null;
    this.error = null;
  }

  eliminarUbicacion(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta ubicación?\')) {
      this.ubicacionService.deleteUbicacion(id).subscribe({
        next: () => {
          this.ubicaciones = this.ubicaciones.filter(u => u.idUbicacion !== id);
          this.cancelarEdicion();
          this.error = null;
        },
        error: (err) => this.manejarError(err)
      });
    }
  }

  private validarUbicacion(ubicacion: any): boolean {
    return ubicacion.ciudad && ubicacion.departamento && ubicacion.direccion && ubicacion.pais;
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
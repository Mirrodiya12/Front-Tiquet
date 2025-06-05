import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  usuario: any = {
    nombre: '',
    correo: '',
  };
  correoOriginal: string = '';

  error: string = '';
  mensajeExito: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const usuarioActual = this.authService.getUsuario();
    if (usuarioActual) {
      this.usuario.nombre = usuarioActual.nombre;
      this.usuario.correo = usuarioActual.correo;
      this.correoOriginal = usuarioActual.correo;
    }
  }

  onSubmit() {
    const token = this.authService.getToken();
    const usuarioActual = this.authService.getUsuario();

    if (!token || !usuarioActual || !usuarioActual.idUsuario || !usuarioActual.rol) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const datosActualizacion: any = {
      idUsuario: usuarioActual.idUsuario,
      nombre: this.usuario.nombre,
      correo: this.usuario.correo,
      rol: usuarioActual.rol,
      contrasena: ''
    };

    const emailChanging = this.usuario.correo !== this.correoOriginal;

    const userId = usuarioActual.idUsuario;

    if (!userId) {
        console.error('ID de usuario no encontrado. No se puede actualizar el perfil.');
        this.error = 'Error al obtener información del usuario.';
        return;
    }

    this.http.put(`/api/usuario/${userId}`, datosActualizacion, { headers }).subscribe({
      next: (response: any) => {
        this.mensajeExito = 'Perfil actualizado exitosamente';
        this.error = '';
        
        const usuarioActualizadoEnBackend = response;
        const usuarioActualizadoLocal = { 
          ...this.authService.getUsuario(),
          nombre: this.usuario.nombre,
          correo: this.usuario.correo,
        };

        const usuarioFinalParaLocalStorage = usuarioActualizadoEnBackend && usuarioActualizadoEnBackend.idUsuario ?
                                            {...usuarioActualizadoLocal, ...usuarioActualizadoEnBackend} : usuarioActualizadoLocal;

        localStorage.setItem('usuario', JSON.stringify(usuarioFinalParaLocalStorage));

        this.correoOriginal = this.usuario.correo;

        if (emailChanging) {
           alert('Tu correo ha sido actualizado. Por favor, inicia sesión nuevamente.');
           this.authService.logout();
        }
        // Si solo se cambió el nombre, no se hace nada especial después del mensaje de éxito.

      },
      error: (error) => {
        console.error('Error en la actualización del perfil:', error);
        this.error = error.error?.mensaje || 'Error al actualizar el perfil';
        this.mensajeExito = '';
      }
    });
  }

  // Método para volver a la página de eventos según el rol
  volver(): void {
    const usuarioActual = this.authService.getUsuario();
    const rol = usuarioActual?.rol?.nombre?.toLowerCase();

    if (rol === 'organizador') {
      this.router.navigate(['/eventos']);
    } else if (rol === 'consumidor') {
      this.router.navigate(['/pantalla-consumidor']);
    } else {
        this.router.navigate(['/login']);
    }
  }
} 
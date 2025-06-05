import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent {
  contrasenaActual: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  error: string = '';
  mensajeExito: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  onSubmit() {
    if (!this.nuevaContrasena || !this.confirmarContrasena) {
      this.error = 'Por favor, complete los campos de nueva contraseña.';
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.error = 'La nueva contraseña y la confirmación no coinciden.';
      return;
    }

    if (this.nuevaContrasena.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    const token = this.authService.getToken();
    const usuarioActual = this.authService.getUsuario();

    if (!token || !usuarioActual || !usuarioActual.idUsuario) {
      console.error('Información del usuario incompleta para cambiar contraseña.', usuarioActual);
      this.router.navigate(['/login']);
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const datosActualizacion = {
      idUsuario: usuarioActual.idUsuario,
      contrasena: this.nuevaContrasena,
    };

    const userId = usuarioActual.idUsuario;

    this.http.put(`/api/usuario/password/${userId}`, datosActualizacion, { headers }).subscribe({
      next: (response: any) => {
        // Mensaje de éxito y cierre de sesión
        alert('Tu contraseña ha sido actualizada. Por favor, inicia sesión nuevamente.');
        this.authService.logout(); // Esto también redirige a /login
        
        this.error = ''; // Limpiar cualquier error anterior
        this.mensajeExito = ''; // No mostrar mensaje de éxito en la misma pantalla

        // Limpiar los campos después del éxito
        this.contrasenaActual = '';
        this.nuevaContrasena = '';
        this.confirmarContrasena = '';

        // La redirección ya la maneja authService.logout()
      },
      error: (error) => {
        console.error('Error al cambiar contraseña:', error);
        this.error = error.error?.mensaje || 'Error al cambiar contraseña.';
        this.mensajeExito = '';
      }
    });
  }

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
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.correo, this.contrasena).subscribe({
      next: (respuesta) => {
        this.error = '';
        const rol = respuesta.usuario?.rol?.nombre?.toLowerCase();

        if (rol === 'organizador') {
          this.router.navigate(['/eventos']);
        } else if (rol === 'consumidor') {
          this.router.navigate(['/pantalla-consumidor']);
        } else {
          this.error = 'Rol no reconocido.';
        }
      },
      error: (error) => {
        if (error.error?.mensaje) {
          this.error = error.error.mensaje;
        } else {
          this.error = 'Error al intentar iniciar sesión';
        }
      }
    });
  }
}
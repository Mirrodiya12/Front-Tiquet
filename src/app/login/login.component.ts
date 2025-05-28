import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (usuario) => {
        this.error = '';
        const rol = usuario.rol?.nombre?.toLowerCase(); // ✅ CORREGIDO

        if (rol === 'organizador') {
          this.router.navigate(['/eventos']);
        } else if (rol === 'consumidor') {
          this.router.navigate(['/pantalla-consumidor']);
        } else {
          this.error = 'Rol no reconocido.';
        }
      },
      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }
}

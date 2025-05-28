import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {
  nombre: string = '';
  correo: string = '';
  contrasena: string = '';
  rol: string = '';
  roles: any[] = [];
  isSubmitting: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarRoles();
  }

  cargarRoles() {
    this.authService.getRoles().subscribe({
      next: (roles: any[]) => {
        console.log('Roles cargados:', roles);
        this.roles = roles;
      },
      error: (error: any) => {
        console.error('Error al cargar roles:', error);
      }
    });
  }

  onRegister() {
    if (this.isSubmitting) {
      return;
    }

    if (this.nombre && this.correo && this.contrasena && this.rol) {
      this.isSubmitting = true;

      const userData = {
        nombre: this.nombre,
        correo: this.correo,
        contrasena: this.contrasena,
        rol: { idRol: this.rol }
      };

      console.log('Enviando datos al servidor:', userData);

      this.authService.registerUser(userData).subscribe({
        next: (response: any) => {
          console.log('Respuesta del servidor:', response);
          this.isSubmitting = false;
          alert('Usuario registrado exitosamente');
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          this.isSubmitting = false;
          console.error('Error detallado al registrar usuario:', error);
          alert('Error al registrar usuario: ' + (error.error?.message || error.message || 'Error desconocido'));
        }
      });
    } else {
      alert('Por favor, completa todos los campos');
    }
  }

  volverAListarEventos(): void {
  this.router.navigate(['/login']);
  }
}

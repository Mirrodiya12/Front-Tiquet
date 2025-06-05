import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUsuario(): any {
    return this.authService.getUsuario();
  }

  esOrganizador(): boolean {
    const usuario = this.getUsuario();
    return usuario?.rol?.nombre?.toLowerCase() === 'Organizador';
  }

  esConsumidor(): boolean {
    const usuario = this.getUsuario();
    return usuario?.rol?.nombre?.toLowerCase() === 'Consumidor';
  }
} 
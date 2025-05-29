import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Evento } from '../models/evento';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  // Importa Router
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-listar-eventos',
  templateUrl: './listar-eventos.component.html',
  styleUrls: ['./listar-eventos.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ListarEventosComponent implements OnInit {
  eventos: Evento[] = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}  // Inyecta Router

  ngOnInit(): void {
    this.obtenerEventos();
  }

obtenerEventos(): void {
  const usuario = this.authService.getUsuario();

  let url = 'http://localhost:8080/api/eventos';

  if (usuario?.rol?.nombre?.toLowerCase() === 'organizador') {
    url += `?idUsuario=${usuario.idUsuario}`; // Ajusta según cómo el backend espera este parámetro
  }

  this.http.get<Evento[]>(url).subscribe({
    next: (data) => {
      this.eventos = data;
    },
    error: (err) => {
      console.error('Error al obtener eventos:', err);
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
}

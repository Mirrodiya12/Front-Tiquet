import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Evento } from '../models/evento';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  // Importa Router

@Component({
  selector: 'app-listar-eventos',
  templateUrl: './pantalla-consumidor.component.html',
  styleUrls: ['./pantalla-consumidor.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PantallaConsumidorComponent implements OnInit {
  eventos: Evento[] = [];

  constructor(private http: HttpClient, private router: Router) {}  // Inyecta Router

  ngOnInit(): void {
    this.obtenerEventos();
  }

  obtenerEventos(): void {
    this.http.get<Evento[]>('http://localhost:8080/api/eventos').subscribe({
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
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Evento } from '../models/evento';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-listar-eventos',
  templateUrl: './listar-eventos.component.html',
  styleUrls: ['./listar-eventos.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ListarEventosComponent implements OnInit {
  eventos: Evento[] = [];

  constructor(private http: HttpClient) {}

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
}

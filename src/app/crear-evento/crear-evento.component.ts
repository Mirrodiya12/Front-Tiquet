import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../services/evento.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // <- ESTA LÍNEA ES CRUCIAL
})
export class CrearEventoComponent implements OnInit {
  usuarios: any[] = [];
  estados: any[] = [];
  ubicaciones: any[] = [];

  evento = {
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    tipoEvento: '',
    stockGeneral: 0,
    organizador: { idUsuario: '' },
    estado: { idEstadoEvento: '' },
    ubicacion: { idUbicacion: '' }
  };

  constructor(private eventoService: EventoService, private router: Router) {}

  ngOnInit(): void {
    this.eventoService.getUsuarios().subscribe(data => this.usuarios = data);
    this.eventoService.getEstados().subscribe(data => this.estados = data);
    this.eventoService.getUbicaciones().subscribe(data => this.ubicaciones = data);
  }

  crearEvento(): void {
    this.eventoService.crearEvento(this.evento).subscribe({
      next: () => alert('Evento creado correctamente'),
      error: (err) => console.error('Error al crear evento:', err)
    });
  }

  volverAListarEventos(): void {
  this.router.navigate(['/eventos']);
  }
}

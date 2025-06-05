import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../interfaces/categoria.interface';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-listar-categorias-evento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-categorias-evento.component.html',
  styleUrl: './listar-categorias-evento.component.css'
})
export class ListarCategoriasEventoComponent implements OnInit {
  eventoId: string = '';  // Cambiado a string con valor inicial vacío
  categorias: Categoria[] = []; // Usaremos un array para el listado
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const eventoId = params['eventoId'];
      if (eventoId) {
        this.eventoId = eventoId;
        this.cargarCategorias(this.eventoId);
      } else {
        this.error = 'No se proporcionó un ID de evento válido';
        this.loading = false;
      }
    });
  }

  cargarCategorias(eventoId: string): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias.filter(cat => cat.idEvento === eventoId);
        this.loading = false;
      },
      error: (error) => {
        // console.error('Error al cargar categorías:', error);
        this.error = 'Error al cargar las categorías';
        this.loading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CategoriaComponent implements OnInit {
  categoria: Categoria = {
    idCategoria: '',
    nombre: '',
    precio: 0,
    stock: 0,
    fechaExpira: '',
    idEvento: '',
    evento: null
  };
  eventoId: string = '';
  error: string = '';
  categorias: Categoria[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Parámetros recibidos:', params);
      this.eventoId = params['eventoId'];
      console.log('ID del evento:', this.eventoId);
      
      if (this.eventoId) {
        this.categoria.idEvento = this.eventoId;
        // Asegurarse de que el objeto evento esté presente con el idEvento
        this.categoria.evento = { idEvento: this.eventoId };
        this.cargarCategorias();
      } else {
        this.error = 'ID de evento no válido';
      }
    });
  }

  cargarCategorias(): void {
    // Obtener todas las categorías y luego filtrar por eventoId en el frontend
    // Esto es necesario si la API no soporta filtrar directamente por eventoId
    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias) => {
        console.log('Categorías recibidas:', categorias);
        console.log('ID del evento para filtrar:', this.eventoId);
        // Asegurarse de que la comparación sea correcta (string con string)
        // Añadir logs para depurar el filtro
        this.categorias = categorias.filter(cat => {
          console.log(`Comparando cat.idEvento (${cat.idEvento}) con this.eventoId (${this.eventoId})`);
          return cat.idEvento === this.eventoId;
        });
        console.log('Categorías filtradas:', this.categorias);

        // Formatear fechas para el input datetime-local al cargar categorías existentes
        this.categorias.forEach(cat => {
          if (cat.fechaExpira) {
            const date = new Date(cat.fechaExpira);
            cat.fechaExpira = date.toISOString().slice(0, 16);
          }
        });

      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.error = 'Error al cargar las categorías';
      }
    });
  }

  onSubmit(): void {
    if (!this.eventoId) {
      this.error = 'Debe seleccionar un evento';
      return;
    }

    // Formatear la fecha para el backend (ISO 8601)
    const fechaExpira = new Date(this.categoria.fechaExpira);
    this.categoria.fechaExpira = fechaExpira.toISOString();

    // Asegurarse de que el evento esté correctamente configurado
    this.categoria.evento = { idEvento: this.eventoId };

    console.log('Creando categoría:', this.categoria);
    this.categoriaService.crearCategoria(this.categoria).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        // Recargar las categorías después de crear una nueva
        this.cargarCategorias();
        // Resetear el formulario manteniendo el eventoId
        this.categoria = {
          idCategoria: '',
          nombre: '',
          precio: 0,
          stock: 0,
          fechaExpira: '', // Resetear la fecha también
          idEvento: this.eventoId,
          evento: { idEvento: this.eventoId }
        };
        this.error = ''; // Limpiar cualquier error anterior
        // Redirigir a la lista de eventos
        this.volverAListarEventos();
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
        if (error.status === 403) {
          this.error = 'No tiene permisos para crear categorías';
        } else {
          this.error = error.error?.message || 'Error al crear la categoría';
        }
      }
    });
  }

  volverAListarEventos(): void {
    this.router.navigate(['/eventos']);
  }
}
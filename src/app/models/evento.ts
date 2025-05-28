export interface Evento {
  idEvento: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  tipoEvento: string;
  stockGeneral: number;

  idEstadoEvento: string;
  idOrganizador: string;
  idUbicacion: string;

  // Objetos anidados, si los devuelve el backend:
  estado?: {
    nombre: string;
  };
  organizador?: {
    nombre: string;
    correo: string;
  };
  ubicacion?: {
    direccion: string;
    ciudad: string;
    pais: string;
  };
}

export interface Usuario {
  idUsuario: string;
  nombre: string;
  correo: string;
  rol: {
    idRol: string;
    nombre: string;
  };
} 
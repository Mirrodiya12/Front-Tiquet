import { Usuario } from './usuario';

export interface AuthResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
} 
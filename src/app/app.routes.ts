import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ListarEventosComponent } from './listar-eventos/listar-eventos.component';
import { CrearEventoComponent } from './crear-evento/crear-evento.component';
import { PantallaConsumidorComponent } from './pantalla-consumidor/pantalla-consumidor.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { UbicacionCrudComponent } from './ubicacion-crud/ubicacion-crud.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { ListarCategoriasEventoComponent } from './listar-categorias-evento/listar-categorias-evento.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // ruta raíz redirige a login
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'eventos', component: ListarEventosComponent },
  { path: 'crear-evento', component: CrearEventoComponent }, // ruta para crear evento
  { path: 'pantalla-consumidor', component: PantallaConsumidorComponent },
  { path: 'editar-perfil', component: EditarPerfilComponent },
  { path: 'cambiar-contrasena', component: CambiarContrasenaComponent },
  { path: 'ubicaciones', component: UbicacionCrudComponent },
  { path: 'categorias/:eventoId', component: CategoriaComponent },
  { path: 'listar-categorias/:eventoId', component: ListarCategoriasEventoComponent },
  { path: '**', redirectTo: '/login' }  // ruta comodín al final
];





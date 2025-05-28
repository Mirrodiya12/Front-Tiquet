import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ListarEventosComponent } from './listar-eventos/listar-eventos.component';
import { CrearEventoComponent } from './crear-evento/crear-evento.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // ruta raíz redirige a login
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'eventos', component: ListarEventosComponent },
  { path: 'crear-evento', component: CrearEventoComponent }, // ruta para crear evento
  { path: '**', redirectTo: '/login' }  // ruta comodín al final
];





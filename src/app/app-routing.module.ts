import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ListarEventosComponent } from './listar-eventos/listar-eventos.component';
import { CrearEventoComponent } from './crear-evento/crear-evento.component';
import { UbicacionCrudComponent } from './ubicacion-crud/ubicacion-crud.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'eventos', component: ListarEventosComponent },
  { path: 'crear-evento', component: CrearEventoComponent },
  { path: 'ubicaciones', component: UbicacionCrudComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

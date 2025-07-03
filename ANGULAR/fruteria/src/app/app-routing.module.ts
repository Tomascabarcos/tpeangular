import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FruteriaComponent } from './componentes/fruteria-contenido/fruteria-contenido.component';
import { FruteriaRegistrarComponent } from './componentes/formulario/fruteria-registrar/fruteria-registrar.component';
import { FruteriaLoginComponent } from './componentes/formulario/fruteria-login/fruteria-login.component';
import { FruteriaRecuperarcontraseniaComponent } from './componentes/formulario/fruteria-recuperarcontrasenia/fruteria-recuperarcontrasenia.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'fruteria',
    pathMatch: 'full'
  },
  {
    path: 'fruteria',
    component: FruteriaComponent
  },
  {
    path: 'registrarse',
    component: FruteriaRegistrarComponent
  },
  {
    path: 'loguearse',
    component : FruteriaLoginComponent 
  },
  {
    path : 'olvidastecontrasenia',
    component : FruteriaRecuperarcontraseniaComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

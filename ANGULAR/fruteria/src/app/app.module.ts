import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FruteriaListComponent } from './componentes/fruteria-list/fruteria-list.component';
import { CarritocompraComponent } from './componentes/fruteria-carrito-compra/fruteria-carrito-compra.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FruteriaComponent } from './componentes/fruteria-contenido/fruteria-contenido.component';
import { FruteriaRegistrarComponent } from './componentes/formulario/fruteria-registrar/fruteria-registrar.component';
import { InputIntegerComponent } from './componentes/input-integer/input-integer.component';
import { HttpClientModule } from '@angular/common/http';
import { FruteriaLoginComponent } from './componentes/formulario/fruteria-login/fruteria-login.component';
import { FruteriaRecuperarcontraseniaComponent } from './componentes/formulario/fruteria-recuperarcontrasenia/fruteria-recuperarcontrasenia.component';

@NgModule({
  declarations: [
    AppComponent,
    FruteriaListComponent,
    CarritocompraComponent,
    FruteriaComponent,
    InputIntegerComponent,
    FruteriaRegistrarComponent,
    FruteriaLoginComponent,
    FruteriaRecuperarcontraseniaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

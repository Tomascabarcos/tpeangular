import { Injectable } from '@angular/core';
import { Fruta } from './componentes/fruteria-list/fruteria-list';
import { BehaviorSubject } from 'rxjs';
  //MANEJA LA LOGICA DEL CARRITO
@Injectable({
  providedIn: 'root'
})
export class CarritofrutaService {
  private _listacarrito: Fruta[] = [];
  listacarrito: BehaviorSubject <Fruta[]> = new BehaviorSubject (this._listacarrito);
  public frutas: Fruta[] = [];

  constructor() { }
 

  agregaralcarrito(fruta: Fruta) {

    let item: Fruta  = this._listacarrito.find((v1) => v1.nombre == fruta.nombre)!;
    //no me agrega la fruta dos veces
    if(!item){
        this._listacarrito.push({... fruta});
    }else{
        item.cantidad = item.cantidad + fruta.cantidad;
    }
    
    console.log(this._listacarrito);
    
    this.listacarrito.next(this._listacarrito); //igual a emit notifico el cambio
  }
 
  
  devolverStock(fruta: Fruta) {
    const f = this.frutas.find(f => f.nombre === fruta.nombre);
    if (f) {
      f.stock =  f.stock+  fruta.cantidad; // devolver al stock
      f.cantidad = 0;
      f.maximoalcanzado = false;
    }
  }

  eliminarlistacarrito(fruta: Fruta) {
    let pos = this._listacarrito.findIndex(item => item.nombre === fruta.nombre);
    if (pos !== -1) {
      
      this.devolverStock(this._listacarrito[pos]);

      this._listacarrito.splice(pos, 1);  // elimino 1 elemento en la posición pos
      this.listacarrito.next(this._listacarrito); //notifico el cambio
    } 
  } 
  
  
  
}
  
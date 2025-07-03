import { Component } from '@angular/core';
import { CarritofrutaService } from '../../carritofruta.service';
import { Fruta } from '../fruteria-list/fruteria-list';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fruteria-carrito-compra',
  standalone: false,
  templateUrl: './fruteria-carrito-compra.component.html',
  styleUrl: './fruteria-carrito-compra.component.scss'
})

export class CarritocompraComponent {

  listacarrito: Fruta[] =[]; 
  //me suscribo  
  constructor(private  carritocompra: CarritofrutaService){
    carritocompra.listacarrito.subscribe(c => this.listacarrito = c); 

  }

  eliminarlistacarrito(fruta : Fruta){
     this.carritocompra.eliminarlistacarrito(fruta);
     fruta.maximoalcanzado = false //oculto el mensaje si se elimina del carrito
     fruta.cantidad = 0 //reinicio cantidad
  }


}

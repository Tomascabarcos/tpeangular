import { Component } from '@angular/core';
import { Fruta} from './fruteria-list';
import { CarritofrutaService } from '../../carritofruta.service';
import { CarritocompraComponent } from '../fruteria-carrito-compra/fruteria-carrito-compra.component';
import { FruteriaDataService } from '../../fruteria-data.service';
import { LoginFormService } from '../../login-form.service';

@Component({
  selector: 'app-fruteria-list',
  standalone: false,
  templateUrl: './fruteria-list.component.html',
  styleUrl: './fruteria-list.component.scss'
})
export class FruteriaListComponent {

  frutas: Fruta[] = [];

  constructor(private  carritocompra: CarritofrutaService,
              private frutasdataService : FruteriaDataService,
              public loginservice : LoginFormService
  ){
      this.carritocompra.frutas = this.frutas;
  }


  ngOnInit() : void {
    this.frutasdataService.obtenertodo()
      .subscribe(fruta => {
        this.frutas = fruta.map(f => ({
          ...f,
          cantidad: 0,
          maximoalcanzado: false
        }));
        this.carritocompra.frutas = this.frutas;
      });
  }
  
  agregaralcarrito(fruta: Fruta) : void{ 

    if(!this.loginservice.estaAutenticadoAhora()){
      alert('DEBES ESTAR LOGUEADO PARA COMPRAR');
      return;
    }

    this.carritocompra.agregaralcarrito(fruta);
    fruta.stock  = fruta.stock - fruta.cantidad;
    //lo reinicio a 0 para la siguiente compra
    fruta.cantidad = 0;
    fruta.maximoalcanzado =false;//oculto el mensaje luego de comprar
  }

  //esto es para mensaje maximo alcanzado
    maximoalcanzado(event: boolean, pos: number) {
    const fruta = this.frutas[pos];
    
    if (fruta.stock === 0 || fruta.cantidad < fruta.stock) {
      fruta.maximoalcanzado = false;
    } else {
      fruta.maximoalcanzado = event;
    }
  }
}



  
  


  
 



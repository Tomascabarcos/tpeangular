import { Component, Input,  EventEmitter , Output } from '@angular/core';
import { Fruta } from '../fruteria-list/fruteria-list';

@Component({
  selector: 'app-input-integer',
  standalone: false,
  templateUrl: './input-integer.component.html',
  styleUrl: './input-integer.component.scss'
})
export class InputIntegerComponent {
  @Input() 
  autenticado : boolean = false;

  @Input() 
  cantidad!: number;

  @Input()
  max!:number;

  @Output()
  //significa cambiar cantidad
  cantidadChange: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  maximoalcanzado: EventEmitter<boolean> = new EventEmitter<boolean>();
 
  //funciones que tienen eventos 

  // Siempre emite: cantidad y si se alcanzó el máximo
  emitir() : void{
    this.cantidadChange.emit(this.cantidad);
    this.maximoalcanzado.emit(this.cantidad >= this.max);
  }

  incrementarcantidad(): void {
    if (!this.autenticado) {
      alert('DEBES ESTAR LOGUEADO PARA COMPRAR');
      return;
    }
    if (this.cantidad < this.max) {
      this.cantidad++;
    }
    this.emitir();
  }

  decrementarcantidad(): void {
    if (!this.autenticado) {
      alert('DEBES ESTAR LOGUEADO PARA COMPRAR');
      return;
    }
    if (this.cantidad > 0) {
      this.cantidad--;
    }
    this.emitir();
  }
 
  // detectar cambios al escribir en el input
  onInputChange(event: Event): void {
    const valor = Number((event.target as HTMLInputElement).value);

    if (isNaN(valor) || valor < 0) {
      this.cantidad = 0;
    } else if (valor > this.max) {
      this.cantidad = this.max;
    } else {
      this.cantidad = valor;
    }

    this.emitir();
  }

  permitirnumeros(fruta : KeyboardEvent) : void{2
    const tecla = fruta.key;
    const teclaspermitidas   = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];

    if((tecla<'0' ||  tecla>'9') && !teclaspermitidas.includes(tecla)){
        fruta.preventDefault();
        this.cantidadChange.emit(this.cantidad);
    }
  }
}

 
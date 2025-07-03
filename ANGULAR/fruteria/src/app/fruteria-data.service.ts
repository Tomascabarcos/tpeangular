import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Fruta } from './componentes/fruteria-list/fruteria-list';

const URL = 'https://6828e09c6075e87073a5309c.mockapi.io/fruteria';

@Injectable({
  providedIn: 'root'
})
export class FruteriaDataService {

  constructor(private http: HttpClient) { }
  /*Consume una api de frutas y devuelve un observable a la respuesta */
  public obtenertodo() : Observable<Fruta[]> {
    return this.http.get<Fruta[]>(URL)
      .pipe(
        tap((fruta:Fruta[])=> fruta.forEach(fruta  => fruta.cantidad=0))
      );
     //consumir la api rest
  }
}

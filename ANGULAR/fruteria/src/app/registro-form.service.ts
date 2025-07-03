import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private urlform = 'https://6828e09c6075e87073a5309c.mockapi.io/usuarios';

  constructor(private http: HttpClient) {}

  enviarFormulario(datos: any): Observable<any> {
    return this.http.post(this.urlform, datos);
  }

  generarNumeroAleatorio(): number {
    return Math.floor(Math.random() * 1000) + 1;
  }
}
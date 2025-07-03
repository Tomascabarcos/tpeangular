import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LoginFormService {
  private listaemails : string[]=[];
  private url = 'https://6828e09c6075e87073a5309c.mockapi.io/usuarios';
  private autenticado$ = new BehaviorSubject<boolean>(this.cargarEstadoDesdeStorage());
  private emails$ = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {
    // cargo los emails solo una vez al iniciar el servicio
    this.http.get<any[]>(this.url).pipe(
      map(usuarios => usuarios.map(u => u.email)),
      catchError(() => of([]))
    ).subscribe(emails => {
      this.listaemails = emails;
    });
  }

  obteneremails(): string[] {
    return this.listaemails;
  }

  login(email: string, contrasenia: string): Observable<boolean> {
    return this.http.get<any[]>(this.url).pipe(
      map(usuarios => {
        const usuarioValido = usuarios.find(u => u.email === email && u.contrasenia === contrasenia);
        const logueado = !!usuarioValido;
        this.autenticado$.next(logueado);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth', String(logueado));
        }
        return logueado;
      })
    );
  }

  cerrarsesion(): void {
    this.autenticado$.next(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth');
    }
  }

  estaAutenticado(): Observable<boolean> {
    return this.autenticado$.asObservable();
  }

  actualizarAutenticacion(valor: boolean): void {
    this.autenticado$.next(valor);
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth', String(valor));
    }
  }

  private cargarEstadoDesdeStorage(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem('auth') === 'true';
  }

  estaAutenticadoAhora(): boolean {
    return this.autenticado$.value;
  }

  //recuperar contrasenia

  actualizarContrasenia(email: string, nuevaContrasenia: string): Observable<boolean> {
    return this.http.get<any[]>(this.url).pipe(
      map(usuarios => {
        const usuario = usuarios.find(u => u.email === email);
        if (!usuario) return false;

        const id = usuario.id;
        return { id };
      }),
      // Si encuentro el ID, hago el put
      switchMap(info => {
        if (!info) return of(false);
        return this.http.put(`${this.url}/${info.id}`, { contrasenia: nuevaContrasenia }).pipe(
          map(() => true),
          catchError(() => of(false))
        );
      })
    );
  }
 
}





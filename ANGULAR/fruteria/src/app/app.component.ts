import { Component, computed, inject } from '@angular/core';
import { LoginFormService } from './login-form.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  footer : string = '@2025-FRUTERIA';
  estaAutenticado: boolean = false;

  constructor(private LoginService : LoginFormService){}

  ngOnInit(): void{
    this.LoginService.estaAutenticado().subscribe(valor =>{
    this.estaAutenticado = valor;
    });
  }
  cerrarsesion(){
    this.LoginService.cerrarsesion();
  } 

}

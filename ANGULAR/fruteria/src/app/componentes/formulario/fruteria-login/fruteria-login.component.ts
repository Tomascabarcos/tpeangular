import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginFormService } from '../../../login-form.service';
@Component({
  standalone: false,
  selector: 'app-fruteria-login',
  templateUrl: './fruteria-login.component.html',
  styleUrls: ['./fruteria-login.component.scss']
})
export class FruteriaLoginComponent implements OnInit {
  loginForm!: FormGroup;
  error = false;
  mensajeFormularioInvalido :boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginFormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:      ['', [Validators.required,  Validators.maxLength(33),
        Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[a-zA-Z]{2,}$'), this.erroresDespuesDelArroba()]],
      contrasenia: ['', [Validators.required, Validators.maxLength(20)]]
    });

    // (oculto/actualizo)  el mensaje de error del formulario 
    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginForm.valid && this.mensajeFormularioInvalido) {
        this.mensajeFormularioInvalido = false;
      }

      if(this.error){
        this.error = false;
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.error = false;
      this.mensajeFormularioInvalido = true;
      return;
    }
    this.mensajeFormularioInvalido = false;
    const { email, contrasenia } = this.loginForm.value;

    this.loginService.login(email, contrasenia).subscribe({
      next: autenticado => {
        if (autenticado) {
          this.loginService.actualizarAutenticacion(true); 
          this.error = false;
          this.loginForm.get('email')?.setErrors(null); //borro errores de email
          this.router.navigate(['/fruteria']);
        } else {
          this.error = true;
        }
      },
      error: () => this.error = true
    });
  }

  private erroresDespuesDelArroba(): ValidatorFn {
    return (control: AbstractControl) => {
      let valor: string = control.value || '';
      let partes = valor.split('@');
      let errores: any = {};
      if (partes.length === 2) {
        let textoDespuesDelArroba = partes[1];
        if (/[A-Z]/.test(textoDespuesDelArroba)) {
          errores.Seactivomayuscula = true;
        }
        if (/[^a-zA-Z.]/.test(textoDespuesDelArroba)) {
          errores.SeactivoConNumeros = true;
        }
      }
      //Si hay al menos un error, devolvemos el objeto con los errores y si no el campo input es valido
      if (Object.keys(errores).length > 0) {
        return errores;
      } else {
        return null;
      }
    };
  }
}

  

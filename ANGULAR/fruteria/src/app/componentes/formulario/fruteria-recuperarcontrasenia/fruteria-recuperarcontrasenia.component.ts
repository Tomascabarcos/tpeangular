import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors , ValidatorFn, Validators } from '@angular/forms';
import { LoginFormService } from '../../../login-form.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-fruteria-recuperarcontrasenia',
  standalone: false,
  templateUrl: './fruteria-recuperarcontrasenia.component.html',
  styleUrl: './fruteria-recuperarcontrasenia.component.scss'
})
export class FruteriaRecuperarcontraseniaComponent implements OnInit {
  formRecuperar!: FormGroup;
  mensaje = '';
  error = '';
  mensajeFormularioInvalido :boolean = false;

  constructor(private fb: FormBuilder, private loginService: LoginFormService 
  , private router : Router) {}

  ngOnInit(): void {
    this.formRecuperar = this.fb.group({
        email: ['', [Validators.required ,  Validators.maxLength(33)
        ,Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[a-zA-Z]{2,}$'), this.erroresDespuesDelArroba()]],
        nuevaContrasenia: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
        confirmarContrasenia: ['', [Validators.required , Validators.maxLength(20)]]
    }, { validators: this.validarCoincidenciaDeContrasenias });

    // (oculto/actualizo)  el mensaje de error del formulario 
    this.formRecuperar.valueChanges.subscribe(() => {
      if (this.formRecuperar.valid && this.mensajeFormularioInvalido) {
        this.mensajeFormularioInvalido = false;
      }
    });
  }

  validarCoincidenciaDeContrasenias(control: AbstractControl): ValidationErrors | null {
    const contrasenia = control.get('nuevaContrasenia')?.value;
    const confirmar = control.get('confirmarContrasenia');

    if (!confirmar) return null;

    if (contrasenia !== confirmar.value) {
      confirmar.setErrors({ ...confirmar.errors, contraseniaNoCoincide: true });
    } else {
      if (confirmar.hasError('contraseniaNoCoincide')) {
        const errores = { ...confirmar.errors };
        delete errores['contraseniaNoCoincide'];
        confirmar.setErrors(Object.keys(errores).length ? errores : null);
      }
    }

    return null;
  }
    
  cambiarcontrasenia(): void {
    if (this.formRecuperar.invalid) {
      this.mensajeFormularioInvalido = true;
      this.formRecuperar.markAllAsTouched();
      return;
    }

    const { email, nuevaContrasenia } = this.formRecuperar.value;

    this.loginService.actualizarContrasenia(email, nuevaContrasenia).subscribe({
      next: actualizado => {
        if (actualizado) {
          this.mensaje = 'Contraseña actualizada correctamente';
          this.error = '';

          this.formRecuperar.get('email')?.setErrors(null);

          setTimeout(() => {
            this.router.navigate(['/loguearse']);
          }, 1000);
        } else {
          this.mensaje = '';
          this.error = 'No se encontró el usuario';

          const emailControl = this.formRecuperar.get('email');
          if (emailControl) {
            const erroresActuales = emailControl.errors || {};
            emailControl.setErrors({ ...erroresActuales, usuarioNoEncontrado: true });
          }
        }
      },
      error: () => {
        this.mensaje = '';
      }
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
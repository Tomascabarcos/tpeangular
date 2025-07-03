import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
  AsyncValidatorFn
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from '../../../registro-form.service';
import { LoginFormService } from '../../../login-form.service';
@Component({
  standalone: false,
  selector: 'app-fruteria-registrar',
  templateUrl: './fruteria-registrar.component.html',
  styleUrls: ['./fruteria-registrar.component.scss']
})
export class FruteriaRegistrarComponent implements OnInit {
  registroForm!: FormGroup;
  numeroAleatorio!: number;
  mensajeEnviado = false;
  errorEnvio = false;
  mensajeFormularioInvalido: boolean = false;

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private loginService: LoginFormService,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.numeroAleatorio = this.registroService.generarNumeroAleatorio();
      this.registroForm = this.fb.group({
        nombre:   ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
        apellido: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
        edad:     [null, [Validators.required, Validators.min(18), Validators.max(100)]],
        telefono: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]],

        // Email con el  validador síncrono instantáneo
        email: [
          '',
          [
            Validators.required,
            Validators.maxLength(33),
            Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[a-zA-Z]{2,}$'),
            this.erroresDespuesDelArroba(),
            this.emailExiste.bind(this)
          ]
        ],

        contrasenia:          ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
        confirmarContrasenia: ['', [Validators.required, Validators.maxLength(20)]],
        captcha:              [null, [Validators.required, this.validadorDeCaptcha()]]
      }, {
        validators: this.validarCoincidenciaDeContrasenias()
      });

      // (oculto/actualizo)  el mensaje de error del formulario 
      this.registroForm.valueChanges.subscribe(() => {
        if (this.registroForm.valid && this.mensajeFormularioInvalido) {
          this.mensajeFormularioInvalido = false;
        }
      });
    
  }

  private emailExiste(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) {
      return null;
    }

    const listaEmails = this.loginService.obteneremails();
    const existe = listaEmails.includes(email);

    if (existe) {
      return { emailExiste: true };
    }

    return null;
  }
  
  

  

  private validadorDeCaptcha(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value === this.numeroAleatorio) {
        return null; 
      } else {
        return { captchaIncorrecto: true }; 
      }
    };
  }


  private validarCoincidenciaDeContrasenias(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const contrasenia  = group.get('contrasenia')?.value;
      const confirmar = group.get('confirmarContrasenia');

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
    };
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.mensajeFormularioInvalido = true; 
      this.registroForm.markAllAsTouched();
      return;
    }
    this.mensajeFormularioInvalido = false;
    const { confirmarContrasenia, ...datosregistro } = this.registroForm.value;
    this.registroService.enviarFormulario({
      ...datosregistro,
      numeroaleatorio: this.numeroAleatorio
    }).subscribe({
      next: () => {
        this.mensajeEnviado = true;
        this.errorEnvio = false;
        this.loginService.actualizarAutenticacion(true);
        setTimeout(() => this.router.navigate(['/fruteria']), 1000);
      },
      error: () => {
        this.errorEnvio = true;
      }
    });
  }

  irALoguearse(): void {
    this.router.navigate(['/loguearse']);
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
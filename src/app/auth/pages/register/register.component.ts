import { Component, Signal, signal, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { ageValidator } from '../../../shared/validators/age.validator';
import { EmailService } from '../../services/email.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TipoDocumento } from '../../../shared/interfaces/tipo-documento';
import { TipoDocumentoService } from '../../../dashboard/services/tipo-documento.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, AsyncPipe, ModalComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  tiposDocumento!: Observable<TipoDocumento[]>;
  showPassword = signal(false);
  mostrarBotonDni = true; //por ahora
  authService = inject(AuthService);
  emailService = inject(EmailService);
  toastrService = inject(ToastrService);
  tipoDocumentoService = inject(TipoDocumentoService);
  desactivarBotonDni = false;

  codigoGenerado: string = '';
  codigoControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
  @ViewChild('modal') modal!: ModalComponent;

  registerForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {

    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      tipodocumento: ['', Validators.required],
      fechanacimiento: ['', [
        Validators.required,
        ageValidator(18)
      ]],
      documento: ['', Validators.required],
      telefono: ['', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        Validators.pattern('^[0-9]*$')
      ]],
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      contrasena: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      confirmPassword: ['', Validators.required],
      sexo: ['MASCULINO', Validators.required]
    }, { validator: this.passwordMatchValidator });
    this.registerForm.get('tipodocumento')?.valueChanges.subscribe(() => {
      this.onTipoDocumentoChange();
    });
    this.tiposDocumento = this.tipoDocumentoService.getTiposDocumento({}, true) as Observable<TipoDocumento[]>;
  }

  //verifica que ambas contraseñas sean iguales
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  onTipoDocumentoChange() {
    const tipoDocumento = this.registerForm.get('tipodocumento')?.value;
    const documentoControl = this.registerForm.get('documento');

    if (tipoDocumento === 'DNI') {
      this.mostrarBotonDni = true;
      documentoControl?.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]*$')
      ]);
    } else if (tipoDocumento === 'PASAPORTE') {
      this.registerForm.get('nombres')?.setValue('');
      this.registerForm.get('apellidoPaterno')?.setValue('');
      this.registerForm.get('apellidoMaterno')?.setValue('');
      documentoControl?.setValue('');
      documentoControl?.setValidators([
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12),
        Validators.pattern('^[0-9]*$')
      ]);
      this.mostrarBotonDni = false;
    } if (tipoDocumento === 'CARNET EXT.') {
      this.registerForm.get('nombres')?.setValue('');
      this.registerForm.get('apellidoPaterno')?.setValue('');
      this.registerForm.get('apellidoMaterno')?.setValue('');
      documentoControl?.setValue('');
      documentoControl?.setValidators([
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12),
        Validators.pattern('^[0-9]*$')
      ]);
      this.mostrarBotonDni = false;
    }

    documentoControl?.updateValueAndValidity();
  }

  //actualiza en estado de la variable
  switchPasswordVisibility() {
    this.showPassword.update(value => !value)
  }

  //getters para reducir la lógica en el html
  get emailControl(): FormControl | null {
    return this.registerForm.get('email') as FormControl;
  }
  get birthDateControl(): FormControl | null {
    return this.registerForm.get('fechanacimiento') as FormControl;
  }
  get documentControl(): FormControl | null {
    return this.registerForm.get('documento') as FormControl;
  }
  get phoneControl(): FormControl | null {
    return this.registerForm.get('telefono') as FormControl;
  }
  get namesControl(): FormControl | null {
    return this.registerForm.get('nombres') as FormControl;
  }
  get lastName1Control(): FormControl | null {
    return this.registerForm.get('apellidoPaterno') as FormControl;
  }
  get lastName2Control(): FormControl | null {
    return this.registerForm.get('apellidoMaterno') as FormControl;
  }
  get passwordControl(): FormControl | null {
    return this.registerForm.get('contrasena') as FormControl;
  }
  get confirmPasswordControl(): FormControl | null {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  onDocumentChange(): void {
    this.registerForm.get('nombres')?.reset();
    this.registerForm.get('apellidoPaterno')?.reset();
    this.registerForm.get('apellidoMaterno')?.reset();
  }

  obtenerNombresApellidos() {
    this.authService.getNamesWithReniecService(this.registerForm.get('documento')?.value ?? '').subscribe({
      next: (response) => {
        this.registerForm.get('nombres')?.setValue(response.nombres);
        this.registerForm.get('apellidoPaterno')?.setValue(response.apellidoPaterno);
        this.registerForm.get('apellidoMaterno')?.setValue(response.apellidoMaterno);
      },
      error: (error) => {
        console.log('Error:' + error.message);
        alert(error.message);
      }
    });
  }
  enviarCodigoVerificacion() {
    this.emailService.sendCode({ email: this.registerForm.get('email')?.value }).subscribe({
      next: (response) => {
        console.log(response);
        this.codigoGenerado = response.code;
        this.modal.open();
      },
      error: (error) => {
        console.log(error);
        this.toastrService.error("Error");
      }
    });
  }
  verificarCodigo() {
    if (this.codigoControl.value === this.codigoGenerado) {
      this.registrar();
    } else {
      this.toastrService.error('El código no es correcto');
    }
  }
  registrar(): void {
    if (this.registerForm.valid) {
      this.authService.register({
        correo: this.registerForm.get('email')?.value,
        tipoDocumento: this.registerForm.get('tipodocumento')?.value,
        documento: this.registerForm.get('documento')?.value,
        nombres: this.registerForm.get('nombres')?.value,
        apellidoPaterno: this.registerForm.get('apellidoPaterno')?.value,
        apellidoMaterno: this.registerForm.get('apellidoMaterno')?.value,
        fechaNacimiento: this.registerForm.get('fechanacimiento')?.value,
        telefono: this.registerForm.get('telefono')?.value,
        sexo: this.registerForm.get('sexo')?.value,
        contrasena: this.registerForm.get('contrasena')?.value
      }).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/dashboard/appointment']);
        },
        error: (error) => {
          console.log('Error:' + error.message);
          this.toastrService.error(error.error.message);
        }
      });
      console.log('Formulario válido', this.registerForm.value);
      this.router.navigate(['/dashboard/appointment']);
    }
  }
}


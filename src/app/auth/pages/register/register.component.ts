import { Component, Signal, signal, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { ageValidator } from '../../../shared/validators/age.validator';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  showPassword = signal(false);
  mostrarBotonDni = signal(true); //por ahora
  authService = inject(AuthService);
  tiposDocumento = [];

  registerForm: FormGroup;

  constructor(private router: Router,private fb: FormBuilder) {
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
  }

  //verifica que ambas contraseñas sean iguales
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  //actualiza en estado de la variable
  switchPasswordVisibility(){
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

    obtenerNombresApellidos(){
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

  onSubmit(): void {
  if (this.registerForm.valid) {
    console.log('Formulario válido', this.registerForm.value);
    this.router.navigate(['/dashboard/reserva']);
  } else {
    this.registerForm.markAllAsTouched();
  }
}

}

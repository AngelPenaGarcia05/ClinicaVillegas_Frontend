import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { response } from 'express';
import { error } from 'console';
import { Route, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showPassword = signal(false);

  authService = inject(AuthService);
  toastService = inject(ToastrService);
  
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }
  switchPasswordVisibility(){this.showPassword.update(value => !value)}

  get emailControl(): FormControl | null {return this.loginForm.get('email') as FormControl;}

  get passwordControl(): FormControl | null {return this.loginForm.get('password') as FormControl;}

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulario válido', this.loginForm.value);
      this.authService.login({
        email: this.emailControl?.value,
        contrasena: this.passwordControl?.value
      }).subscribe({
        next: (response) =>{
          console.log(response);
          this.router.navigate(['dashboard/appointment']);
          this.toastService.success('Inicio de sesión exitoso', 'Bienvenido');
        },
        error: (error) => {
          this.toastService.error('Error al iniciar sesión', 'Por favor, verifica tus credenciales');
          console.log(error);
        }
      })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ComentarioService } from '../../services/comentario.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Comentario } from '../../interfaces/comentario';
import { map, Observable } from 'rxjs';
import { Usuario } from '../../../shared/interfaces/usuario';


@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {

  comentarioService = inject(ComentarioService);
  authService = inject(AuthService);
  toast = inject(ToastrService);

  comentarios: Comentario[] = [];
  user$: Observable<Usuario>;
  userRole = '';
  userId = 0;
  nombresUsuario = '';
  trackedQuestionId: number | null = null;
  disabledButton = false;

  // paginación
  currentPage = 0;
  totalPages = 0;
  pageSize = 5;

  preguntaPaciente = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(500)
  ]);

  constructor() {
    this.user$ = this.authService.fetchUser();
    this.user$.pipe(
          map(user => {
              this.userId = user ? user.id : 0;
              this.userRole = user ? user.rol : '';
              this.nombresUsuario = user ? `${user.apellidoPaterno} ${user.apellidoMaterno}, ${user.nombres}` : '';
            }
          )
        );
    if (this.userRole === 'PACIENTE' || !this.userRole) {
      this.disabledButton = true;
    }
    this.loadComentarios();
  }

  loadComentarios(): void {
    this.comentarioService.getComentarios(this.currentPage, this.pageSize).subscribe({
      next: (resp) => {
        this.comentarios = resp.content;
        this.totalPages = resp.totalPages;
      },
      error: (err) => {
        this.toast.error('Error al cargar comentarios');
        console.error(err);
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadComentarios();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadComentarios();
    }
  }

  comentar(): void {
    if (this.preguntaPaciente.valid && this.userId) {
      this.comentarioService.createComentario(
        this.preguntaPaciente.value ?? '',
        this.userId,
        this.trackedQuestionId
      ).subscribe({
        next: () => {
          this.toast.success('Comentario creado');
          this.preguntaPaciente.reset();
          this.currentPage = 0; // volver a la primera página
          this.loadComentarios(); // recargar
        },
        error: (error) => {
          console.error('Error durante el comentario:', error);
          this.toast.error('Error al enviar el comentario');
        }
      });
    } else {
      this.toast.info('Debes escribir un comentario válido');
    }
  }
}

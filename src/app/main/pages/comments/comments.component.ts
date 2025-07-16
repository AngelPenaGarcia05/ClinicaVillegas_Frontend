import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ComentarioService } from '../../services/comentario.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Comentario } from '../../interfaces/comentario';
import { map, Observable } from 'rxjs';
import { Usuario } from '../../../shared/interfaces/usuario';
import { QuestionComponent } from '../../components/question/question.component';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';


@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [ReactiveFormsModule, QuestionComponent, PaginationComponent],
  template: `
  <div class="d-flex flex-column justify-content-center comentarios">
    @if (userRole === 'PACIENTE') {
    <div class="comentario-input-card card">
        <input type="text" class="form-control input-cometario" [formControl]="preguntaPaciente"
            placeholder="Escribe tu comentario aquí...">
        <button class="btn btn-primary btn-comentario" (click)="comentar()" [disabled]="preguntaPaciente.invalid"
            style="background-color: #c7f3f3; color: #146356; border: 1px solid #a0d8c3;">Comentar</button>
    </div>
    }
    @for (comentario of comentarios; track $index) {
    <app-question class="comentario-card card" [pregunta]="comentario" [disabledButton]="disabledButton" [userId]="userId"
        [userRole]="userRole" (recargarComentarios)="loadComentarios()"></app-question>
    }
    <app-pagination [totalPages]="totalPages" [currentPage]="currentPage" (pageChange)="onPageChange($event)"></app-pagination>
  </div>
  `,
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {

  comentarioService = inject(ComentarioService);
  authService = inject(AuthService);
  toast = inject(ToastrService);

  plataform = inject(PLATFORM_ID);

  comentarios: Comentario[] = [];
  user$!: Observable<Usuario | null>;
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

  ngOnInit(): void {
    if(isPlatformBrowser(this.plataform)){
      this.loadComentarios();
    }

    this.user$ = this.authService.fetchUser();
    this.user$.subscribe(user => {
      this.userId = user?.id ?? 0;
      this.userRole = user?.rol ?? '';
      this.nombresUsuario = user
        ? `${user.apellidoPaterno} ${user.apellidoMaterno}, ${user.nombres}`
        : '';
      this.disabledButton = this.userRole === 'PACIENTE' || !this.userRole;
    });
  }


  loadComentarios(): void {
    this.comentarioService.getComentarios(this.currentPage, this.pageSize).subscribe({
      next: (resp) => {
        this.comentarios = resp.content;
        this.totalPages = resp.page.totalPages;
      },
      error: (err) => {
        this.toast.error('Error al cargar comentarios');
        console.error(err);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadComentarios();

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

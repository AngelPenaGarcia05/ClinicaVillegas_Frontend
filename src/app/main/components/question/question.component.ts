import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnswerComponent } from '../answer/answer.component';
import { Comentario } from '../../interfaces/comentario';
import { ComentarioService } from '../../services/comentario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-question',
  imports: [DatePipe, ReactiveFormsModule, AnswerComponent],
  template: `
    <div class="d-flex align-items-start flex-wrap">
        <img src="media/logo.jpg" alt="User profile" class="user-img me-3" />
        <div class="flex-grow-1">
            <div class="user-name">{{pregunta.nombresUsuario}}-{{pregunta.emailUsuario}}</div>
            <p class="comment-text mt-2">
                {{pregunta.contenido}}
            </p>
            <div class="d-flex justify-content-end text-muted mt-2" style="gap: 10px;">
                <small>{{pregunta.fecha | date: 'medium'}}</small>
                <small>{{pregunta.comentarios.length}} respuestas</small>
                <button class="btn btn-sm responder-btn ms-3" [hidden]="disabledButton" (click)="showResponseBox()">Responder</button>
            </div>
        </div>
    </div>
    <div class="respuesta-card card" [hidden]="disabledReponse">
        <input type="text" class="form-control input-cometario" [formControl]="respuestaDentista"
            placeholder="Escribe tu comentario aquí..." (focus)="trackedQuestionId = pregunta.id" />
        <button class="btn btn-primary btn-comentario" (click)="comentar()" [disabled]="respuestaDentista.invalid"
            style="background-color: #c7f3f3; color: #146356; border: 1px solid #a0d8c3;">Responder</button>
    </div>
    @for (respuesta of pregunta.comentarios; track $index) {
        <app-answer [respuesta]="respuesta"></app-answer>
    }
  `,
  styles: [`
    .user-img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid #a0d8c3;
    }
    .respuesta-card{
      display: flex;
      flex-direction: row;
      padding: 10px;
      width: 100%;
      background-color: #f0f9f9;
      margin-block: 10px;
      gap: 10px;
    }
    .user-name {
      font-weight: bold;
      color: #333333;
    }

    .comment-text {
      background-color: #52b7ae;
      color: white;
      padding: 10px;
      border-radius: 15px;
      font-size: 16px;
    }

    .responder-btn {
      background-color: #a0d8c3;
      border: none;
      color: white;
      font-size: 14px;
      border-radius: 8px;
    }

    .responder-btn:hover {
      background-color: #8fc0b0;
    }
    app-answer{
      width: 100%;
      display: flex;
      justify-content: end;
    }
  `]
})
export class QuestionComponent {
  @Input() pregunta!: Comentario;
  @Input() disabledButton: boolean = false;
  @Input() userId!: number;
  @Input() userRole!: string;

  @Output() recargarComentarios = new EventEmitter<void>();

  comentarioService = inject(ComentarioService);
  toastService = inject(ToastrService);

  respuestaDentista = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]);

  disabledReponse = true;

  trackedQuestionId: number | null = null;

  showResponseBox() {
    this.disabledReponse = !this.disabledReponse;
    this.trackedQuestionId = this.pregunta.id;
  }
  comentar() {
    if (this.respuestaDentista.value != '' && this.userId) {
      this.comentarioService.createComentario(
        this.respuestaDentista.value ?? '',
        this.userId,
        this.trackedQuestionId
      ).subscribe({
        next: (response) => {
          this.toastService.success(response.mensaje);
          this.respuestaDentista.reset();
          this.recargarComentarios.emit();
        },
        error: (error) => {
          console.log('Error durante el comentario:' + error.message);
        }
      })
    }
  }
}

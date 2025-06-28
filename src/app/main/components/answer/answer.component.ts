import { Component, Input } from '@angular/core';
import { Comentario } from '../../interfaces/comentario';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-answer',
  imports: [DatePipe],
  template: `
    <div class="respuesta-card p-3 mb-2">
      <div class="d-flex align-items-start justify-content-end flex-wrap-reverse">
        <div class="flex-grow-1">
          <div class="respuesta-user-name">{{respuesta.nombresUsuario}}-{{respuesta.emailUsuario}}</div>
          <p class="respuesta-text mt-2">
            {{respuesta.contenido}}
          </p>
          <div class="text-muted mt-2 text-end">
            <small>{{respuesta.fecha | date: 'medium'}}</small>
          </div>
        </div>
        <img [src]="respuesta.imagenUsuario" alt="User profile" class="respuesta-user-img ms-3" />
      </div>
    </div>
  `,
  styles: [`
    .respuesta-card {
      width: 80%;
    }

    .respuesta-user-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #a0d8c3;
    }

    .respuesta-user-name {
      font-weight: bold;
      color: #333333;
      text-align: right;
    }

    .respuesta-text {
      padding: 10px;
      border-radius: 15px;
      font-size: 16px;
      text-align: right;
    }

    .text-end {
      text-align: right;
    }
  `]
})
export class AnswerComponent {
  @Input() respuesta!: Comentario;
}

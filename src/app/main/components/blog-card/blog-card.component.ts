import { Component, input } from '@angular/core';

@Component({
  selector: '.blog-card',
  imports: [],
  template: `
    <div class="card h-100 shadow-sm">
      <img [src]="cardInfo().image" class="card-img-top img-fluid" [alt]="cardInfo().title">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-center text-purple">{{cardInfo().title}}</h5>
        <p class="card-text">{{cardInfo().description}}</p>
        <div class="mt-auto">
          <small class="text-muted">by {{cardInfo().author}}</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-purple {
      color: #6a1b9a;
    }

    .card-img-top {
      height: 200px;
      object-fit: cover;
    }
  `]
})
export class BlogCardComponent {
  cardInfo = input.required<CardInfo>();
}
export interface CardInfo{
  image: string,
  title: string,
  description: string,
  author: string
}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-treatment-card',
  standalone: true,
  imports: [],
  template: `
    <div class="card-container rounded-4 p-3 p-md-4 mb-4">
      <div class="row g-4 align-items-center">
        <div class="col-lg-6 order-lg-1 order-2">
          <h2 class="text-blue-light mb-3">{{ treatmentType().title }}</h2>
          <p class="text-white mb-3">{{ treatmentType().description }}</p>
          <ul class="text-white list-unstyled row">
            @for (treatment of treatmentType().treatments; track $index) {
              <li class="col-md-6 mb-2">
                <i class="bi bi-check-circle-fill text-blue-light me-2"></i>
                {{ treatment }}
              </li>
            }
          </ul>
        </div>
        <div class="col-lg-6 order-lg-2 order-1">
          <div class="treatment-image-container">
            <img 
              class="img-fluid rounded-3 w-100 h-auto" 
              [src]="treatmentType().imagePath" 
              [alt]="'Imagen de ' + treatmentType().title"
              loading="lazy"
            >
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-container {
      background-color: var(--blue-color);
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .text-blue-light {
      color: var(--blue-color-light);
    }
    
    .treatment-image-container {
      height: 100%;
      min-height: 250px;
      display: flex;
      align-items: center;
    }
    
    @media (min-width: 992px) {
      .treatment-image-container {
        min-height: 300px;
      }
    }
  `]
})
export class TreatmentCardComponent {
  treatmentType = input.required<TreatmentType>();
}

export interface TreatmentType {
  title: string;
  description: string;
  treatments: string[];
  imagePath: string;
}
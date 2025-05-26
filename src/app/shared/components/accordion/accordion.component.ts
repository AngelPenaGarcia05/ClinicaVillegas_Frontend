import { Component, input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  imports: [],
  template:`
    <div class="accordion mx-3 mx-md-5" id="accordionExample">
      @for (accordionItem of accordionItems(); track $index) {
          <div class="accordion-item mt-3 rounded-4">
              <h2 class="accordion-header">
                  <button class="accordion-button rounded-4 fw-bold text-blue-color" type="button"
                      data-bs-toggle="collapse"
                      [attr.data-bs-target]="'#collapse-' + $index" 
                      [attr.aria-expanded]="$index === 0 ? 'true' : 'false'"
                      [attr.aria-controls]="'collapse-' + $index">
                      {{accordionItem.title}}
                  </button>
              </h2>
              <div [id]="'collapse-' + $index"  class="accordion-collapse collapse" [class.show]="$index === 0"  data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                      <p>{{accordionItem.body}}</p>
                  </div>
              </div>
          </div>
      }
    </div>
  `,
  styles: [`
    .accordion-button.collapsed{
      border: 0.5px solid var(--blue-color-light);
    }
    .accordion-item:has(.accordion-button:not(.collapsed)){
        border: 1px solid var(--blue-color-light);
    }
    .accordion-button:not(.collapsed){
        box-shadow: none;
    }
    .accordion-button::after{
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktcGx1cyIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBkPSJNOCA0YS41LjUgMCAwIDEgLjUuNXYzaDNhLjUuNSAwIDAgMSAwIDFoLTN2M2EuNS41IDAgMCAxLTEgMHYtM2gtM2EuNS41IDAgMCAxIDAtMWgzdi0zQS41LjUgMCAwIDEgOCA0Ii8+Cjwvc3ZnPg==);
    }
    .accordion-button:not(.collapsed)::after{
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktZGFzaCIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBkPSJNNCA4YS41LjUgMCAwIDEgLjUtLjVoN2EuNS41IDAgMCAxIDAgMWgtN0EuNS41IDAgMCAxIDQgOCIvPgo8L3N2Zz4=)
    }
    .accordion{
        --bs-accordion-active-bg: #ffffff;
    }
  `]
})
export class AccordionComponent {
  accordionItems = input.required<AccordionItem[]>();
}
export interface AccordionItem{
  title: string,
  body: string
}

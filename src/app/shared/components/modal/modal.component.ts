import { Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  template: `
  <div class="modal fade" tabindex="-1" role="dialog" [class]="{'show': isVisible}" [style]="{'display': localVisible() ? 'block' : 'none'}">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <ng-content select="[modal-header]"></ng-content>
          <button type="button" class="btn-close" aria-label="Close" (click)="close()"></button>
        </div>
        <div class="modal-body">
          <ng-content select="[modal-body]"></ng-content>
        </div>
        <div class="modal-footer">
          <ng-content select="[modal-footer]"></ng-content>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .modal.show {
      display: block;
      background: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class ModalComponent {
  isVisible = input<boolean>(false);

  localVisible = signal(this.isVisible());

  constructor() {
    effect(() => {
      this.localVisible.set(this.isVisible());
    });
  }

  open(): void { this.localVisible.set(true); }

  close(): void { this.localVisible.set(false); }
}

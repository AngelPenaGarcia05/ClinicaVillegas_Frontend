import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <div class="pagination-container">
      <button class="btn btn-blue-color" 
              (click)="onPageChange(currentPage - 1)" 
              [disabled]="currentPage === 0">
        Anterior
      </button>
      <span class="page-info">
        Página {{ currentPage + 1 }} de {{ totalPages }}
      </span>
      <button class="btn btn-blue-color" 
              (click)="onPageChange(currentPage + 1)" 
              [disabled]="currentPage + 1 >= totalPages">
        Siguiente
      </button>
    </div>
  `,
  styles: [`
    .pagination-container {
      margin-block: 20px;
      display: flex;
      justify-content: center;
      gap: 10px;
      align-items: center;
    }
    .btn-blue-color{
      background-color: var(--blue-color);
      color: white;
    }
    .page-info {
      margin: 0 10px;
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}

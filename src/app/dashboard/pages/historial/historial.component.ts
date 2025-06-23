import { Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cita } from '../../../shared/interfaces/cita';
import { CitaService } from '../../services/cita.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from '../../../shared/interfaces/usuario';
import { Pageable } from '../../../shared/interfaces/page';

@Component({
  selector: 'app-historial',
  imports: [],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent {

  citas: Cita[] = [];
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  citaService = inject(CitaService);
  authService = inject(AuthService);
  userId!: number;
  user$: Observable<Usuario>;

  constructor() {
    this.user$ = this.authService.fetchUser();
    this.user$.pipe(
      map(user =>
        this.userId = user ? user.id : 0
      )
    );
    this.loadCitas();
  }

  loadCitas(): void {
    this.citaService.buscarCitas({ usuarioId: this.userId }, false, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const responseFormat = response as Pageable<Cita>;
        this.citas = responseFormat.content;
        this.totalPages = responseFormat.page.totalPages;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadCitas();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCitas();
    }
  }
}
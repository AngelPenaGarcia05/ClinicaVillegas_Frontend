import { Component, inject } from '@angular/core';

import { map, Observable } from 'rxjs';
import { CitaService } from '../../services/cita.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from '../../../shared/interfaces/usuario';
import { Cita } from '../../interfaces/cita';


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
    this.citaService.getCitas({
      usuarioId: this.userId,
      page: this.currentPage,
      size: this.pageSize
    }).subscribe(response => {
      this.citas = response.content;
      this.totalPages = response.totalPages;
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
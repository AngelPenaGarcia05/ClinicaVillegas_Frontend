import { Component, inject, OnInit } from '@angular/core';
import { CitaService } from '../../services/cita.service';
import { Cita } from '../../Interfaces/Cita';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-historial',
  imports: [AsyncPipe],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {

  citas: Cita[] = [];
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  citaService = inject(CitaService);
  authService = inject(AuthService);
  userId!: number;

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
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
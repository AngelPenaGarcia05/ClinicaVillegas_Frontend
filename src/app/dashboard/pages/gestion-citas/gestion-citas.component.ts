import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CitaService } from '../../services/cita.service';
import { Cita } from '../../interfaces/cita';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../main/components/modal/modal.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './gestion-citas.component.html',
  styleUrl: './gestion-citas.component.css'
})
export class GestionCitasComponent implements OnInit {

  currentPageCita: number = 1;
  totalPagesCita: number = 1;
  paginatedCitas: Cita[] = [];

  citaService = inject(CitaService);
  authService = inject(AuthService);
  dentistaId!: number;
  trackedCita!: Cita;

  formCitas = new FormGroup({
    fechaInicio: new FormControl('2024-11-01', Validators.required),
    fechaFin: new FormControl('2024-12-12', Validators.required),
    estado: new FormControl('Pendiente', Validators.required),
  });

  toastrService = inject(ToastrService);
  @ViewChild('modalAtender') modalAtender!: ModalComponent;
  @ViewChild('modalCancelar') modalCancelar!: ModalComponent;
  constructor() { }

  ngOnInit(): void {
    this.dentistaId = this.authService.getDentistaId();
    this.loadData();
  }
  loadData(): void {
    this.citaService.getCitas({
      dentistaId: this.dentistaId,
      page: this.currentPageCita - 1,
      size: 5
    }).subscribe((data) => {
      this.totalPagesCita = data.totalPages;
      this.paginatedCitas = data.content;
    });
  }
  paginate(data: any[], currentPage: number, pageSize: number): any[] {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    return data.slice(start, end);
  }
  onPageChangeCita(page: number): void {
    if (page < 1 || page > this.totalPagesCita) return;
    this.currentPageCita = page;
    this.loadData(); // Recargar los datos para la nueva página
  }
  openModalToFocus(cita: Cita) {
    this.trackedCita = cita;
    this.modalAtender.open();
  }
  openModalToCancel(cita: Cita) {
    this.trackedCita = cita;
    this.modalCancelar.open();
  }
  atenderReserva() {
    this.citaService.successCita(this.trackedCita.id).subscribe({
      next: (response) => {
        this.modalAtender.close();
        this.toastrService.success(response.mensaje);
        this.loadDataWithParams();
      },
      error: (error) => {
        this.modalAtender.close();
        this.toastrService.error(error.error.message);
      }
    })
  }
  cancelarReserva() {
    this.citaService.deleteCita(this.trackedCita.id).subscribe({
      next: (response) => {
        this.modalCancelar.close();
        this.toastrService.success(response.mensaje);
        this.loadDataWithParams();
      },
      error: (error) => {
        this.modalCancelar.close();
        this.toastrService.error(error.error.message);
      }
    })
  }
  loadDataWithParams(): void {
    this.citaService.getCitas({
      dentistaId: this.dentistaId,
      fechaInicio: this.formCitas.get('fechaInicio')?.value ?? '2024-11-01',
      fechaFin: this.formCitas.get('fechaFin')?.value ?? '2024-12-12',
      estado: this.formCitas.get('estado')?.value ?? 'Pendiente',
      page: this.currentPageCita - 1,
      size: 5
    }).subscribe({
      next: (data) => {
        this.totalPagesCita = data.totalPages;
        this.paginatedCitas = data.content; // ya está paginado desde el backend
      },
      error: (error) => {
        this.toastrService.error(error.error.message);
      }
    });
  }
}


import { Component, inject, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cita } from '../../../shared/interfaces/cita';
import { CitaService } from '../../services/cita.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from '../../../shared/interfaces/usuario';
import { Pageable } from '../../../shared/interfaces/page';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatepickerComponent } from '../../components/datepicker/datepicker.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ToastrService } from 'ngx-toastr';
import { HorarioService } from '../../services/horario.service';
import { Horario } from '../../../shared/interfaces/horario';
import { timeRangeValidator } from '../../../shared/validators/time-range.validator';
import { citaValidator } from '../../../shared/validators/cita.validator';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-historial',
  imports: [ReactiveFormsModule, DatepickerComponent, ModalComponent, PaginationComponent],
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
  toastrService = inject(ToastrService);
  horarioService = inject(HorarioService);
  userId!: number;
  user$: Observable<Usuario | null>;
  horarios!: Observable<Horario[]>

  minDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
  maxDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 5, 0));
  minTimeValue: string | undefined = '';
  maxTimeValue: string | undefined = '';
  disabledDates: Date[] = [];
  activeDaysOfWeek: number[] = [];
  selectedDate: string | null = null;
  horarioSelected: Horario | undefined;
  activarBoton = true;



  @ViewChild('modalCancelacion') modalCancelacion!: ModalComponent;
  @ViewChild('modalReprogramar') modalReprogramar!: ModalComponent;
  trackedCita!: Cita;

  formCitas = new FormGroup({
    fechaInicio: new FormControl('', Validators.required),
    fechaFin: new FormControl('', [Validators.required]),
    estado: new FormControl('', Validators.required),
  });
  formReprogramar: FormGroup;
  formCancelacion: FormGroup;

  constructor(private fb: FormBuilder) {
    this.user$ = this.authService.fetchUser();
    this.user$.subscribe((user) => {
      this.userId = user ? user.id : 0
      this.loadCitas();
    });
    this.formReprogramar = this.fb.group({
      fecha: [{ value: '' }, Validators.required],
      hora: [{ value: '', disabled: true }, Validators.required]
    });
    this.formCancelacion = this.fb.group({
      observaciones: ['', Validators.required]
    });
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
  loadCitasWithParams() {
    this.citaService.buscarCitas({ usuarioId: this.userId, fechaInicio: this.formCitas.get('fechaInicio')?.value ?? '2024-11-01', fechaFin: this.formCitas.get('fechaFin')?.value ?? '2024-12-12', estado: this.formCitas.get('estado')?.value ?? 'Pendiente' }, false, this.currentPage, this.pageSize).subscribe({
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

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.formCitas.valid) {
      this.loadCitasWithParams();
    } else {
      this.loadCitas();
    }
  }

  reprogramarReserva() {
    this.citaService.reprogramarCita(
      this.trackedCita.id,
      {
        hora: this.formReprogramar.get('hora')?.value,
        fecha: this.formReprogramar.get('fecha')?.value,
      }
    ).subscribe({
      next: (data) => {
        this.toastrService.success("Cita reprogramada con éxito");
        this.modalReprogramar.close();
        if (this.formCitas.valid) {
          this.loadCitasWithParams();
        } else {
          this.loadCitas();
        }
      },
      error: (error) => {
        console.error('Error al reprogramar la reserva:', error);
        this.toastrService.error('Error al reprogramar la reserva');
      }
    });
  }
  cancelarReserva() {
    this.citaService.eliminarCita(this.trackedCita.id, { observaciones: this.formCancelacion.get('observaciones')?.value }).subscribe({
      next: (data) => {
        this.toastrService.success("Cita cancelada con éxito");
        if (this.formCitas.valid) {
          this.loadCitasWithParams();
        } else {
          this.loadCitas();
        }
      },
      error: (error) => {
        console.log('Error al cancelar la reserva:' + error.error.message);
      }
    });
    this.modalCancelacion.close();
  }
  establecerHorarios(cita: Cita) {
    const queryparams = {
      dentistaId: cita.dentista.id,
    }
    this.horarios = this.horarioService.obtenerHorarios(queryparams);
    this.horarios.subscribe((data) => {
      this.activeDaysOfWeek = this.horarioService.calculateActiveDays(data);
      this.disabledDates = this.horarioService.calculateDisabledDates();
    });
  }
  openModalToCancel(cita: Cita) {
    this.trackedCita = cita;
    this.modalCancelacion.open();
  }
  openModalToReprogramar(cita: Cita) {
    console.log(this.formReprogramar.value);
    this.formReprogramar.reset();
    this.formReprogramar.get('hora')?.disable();
    this.formReprogramar.get('fecha')?.setValidators([Validators.required]);
    this.formReprogramar.get('hora')?.setValidators([Validators.required]);
    this.trackedCita = cita;
    this.modalReprogramar.open();
  }
  handleDateSelected(date: Date) {
    this.formReprogramar.get('hora')?.reset();
    if (date instanceof Date) {
      const formattedDate = date.toISOString().split('T')[0];
      this.selectedDate = formattedDate;
      this.formReprogramar.get('fecha')?.setValue(formattedDate);
    }
    //obtener el dia de la fecha seleccionada
    let dia = date.toLocaleString('es-ES', { weekday: 'long' })
      .normalize('NFD') // Descompone los caracteres con acento
      .replace(/[\u0300-\u036f]/g, '') // Elimina los diacríticos
      .toUpperCase(); // Convierte a mayúsculas
    //filtrar horario por la fecha seleccionada
    const queryparams = {
      dentistaId: this.trackedCita.dentista.id,
      dia: dia
    };
    this.horarioService.obtenerHorarios(queryparams).subscribe((horarios) => {
      this.horarioSelected = horarios.find((horario) => horario.dia.toUpperCase() === dia);
      this.minTimeValue = this.horarioSelected?.horaComienzo.substring(0, 5);
      this.maxTimeValue = this.horarioSelected?.horaFin.substring(0, 5);
      console.log(this.minTimeValue, this.maxTimeValue);
      this.formReprogramar.get('hora')?.setValidators([
        Validators.required,
        timeRangeValidator(this.minTimeValue ?? '', this.maxTimeValue ?? '')
      ]);
      this.formReprogramar.get('hora')?.setAsyncValidators(
        citaValidator(
          this.citaService,
          this.formReprogramar.get('fecha')?.value,
          this.trackedCita.tratamiento.id,
          this.trackedCita.dentista.id
        )
      );
    });
    this.formReprogramar.get('hora')?.enable();
  }
}
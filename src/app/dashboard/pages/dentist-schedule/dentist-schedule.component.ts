import { Component, inject, ViewChild } from '@angular/core';
import { HorarioService } from '../../services/horario.service';
import { Observable } from 'rxjs';
import { Horario } from '../../../shared/interfaces/horario';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { timeRangeValidator } from '../../../shared/validators/time-range.validator';
import { Usuario } from '../../../shared/interfaces/usuario';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dentist-schedule',
  imports: [ModalComponent, AsyncPipe, ReactiveFormsModule],
  templateUrl: './dentist-schedule.component.html',
  styleUrl: './dentist-schedule.component.css'
})
export class DentistScheduleComponent {
  horarioService = inject(HorarioService);
  horarios!: Observable<Horario[]>;
  authService = inject(AuthService);
  dentistaId!: number;
  user$!: Observable<Usuario>;
  toastService = inject(ToastrService);

  trackedHorario!: Horario;

  agregarHorarioForm = new FormGroup({
    dia: new FormControl('', Validators.required),
    horaInicio: new FormControl('', [Validators.required, timeRangeValidator('09:00', '22:00')]),
    horaFin: new FormControl('', [Validators.required, timeRangeValidator('09:00', '22:00')])
  });

  @ViewChild('modalDelete') modalDelete!: ModalComponent;

  ngOnInit(): void {
    this.user$ = this.authService.fetchUser();
    this.user$.subscribe((user) => {
      this.dentistaId = user ? user.id : 0
      this.loadData({ dentistaId: this.dentistaId });
      console.log('Dentista ID en ngOnInit:', this.dentistaId);
    });
  }
  loadData(queryparams: any): void {
    this.horarios = this.horarioService.obtenerHorarios(queryparams);
  }
  constructor() {

  }
  openModalToDelete(horario: Horario) {
    this.trackedHorario = horario;
    this.modalDelete.open();
  }
  agregarHorario() {
    const data = {
      dia: this.agregarHorarioForm.value.dia,
      horaComienzo: this.agregarHorarioForm.value.horaInicio,
      horaFin: this.agregarHorarioForm.value.horaFin,
      dentistaId: this.dentistaId
    }
    this.horarioService.agregarHorario(data).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.loadData({ dentistaId: this.dentistaId });
      },
      error: (error) => {
        this.toastService.error(error.error.mensaje ?? 'Error al agregar horario');
        console.log(error);
      }
    })
  }
  eliminarHorario() {
    this.horarioService.eliminarHorario(this.trackedHorario.id).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.loadData({ dentistaId: this.dentistaId });
        this.modalDelete.close();
      },
      error: (error) => {
        this.toastService.error(error.error.message);
      }
    })
  }
}

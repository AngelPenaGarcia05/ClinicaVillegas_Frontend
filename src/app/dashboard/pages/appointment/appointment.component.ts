import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Tratamiento } from '../../../shared/interfaces/tratamiento';
import { Dentista } from '../../../shared/interfaces/dentista';
import { TipoTratamiento } from '../../../shared/interfaces/tipo-tratamiento';
import { Horario } from '../../../shared/interfaces/horario';
import { Cita } from '../../../shared/interfaces/cita';
import { TipoDocumento } from '../../../shared/interfaces/tipo-documento';
import { TratamientoService } from '../../services/tratamiento.service';
import { DentistaService } from '../../services/dentista.service';
import { HorarioService } from '../../services/horario.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CitaService } from '../../services/cita.service';
import { ToastrService } from 'ngx-toastr';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { StepperComponent } from '../../components/stepper/stepper.component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoTratamientoService } from '../../services/tipo-tratamiento.service';
import { Usuario } from '../../../shared/interfaces/usuario';
import { timeRangeValidator } from '../../../shared/validators/time-range.validator';
import { citaValidator } from '../../../shared/validators/cita.validator';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { AsyncPipe } from '@angular/common';
import { DatepickerComponent } from '../../components/datepicker/datepicker.component';
import { fechaHoraNoPasadaValidator } from '../../../shared/validators/before-datetime.validator';
import { soloLetrasValidator } from '../../../shared/validators/sololetras.validator';

@Component({
  selector: 'app-appointment',
  imports: [CalendarComponent, StepperComponent, AsyncPipe, ReactiveFormsModule, DatepickerComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent implements OnInit {
  ocultarBotonReserva: boolean = false;
  user$!: Observable<Usuario | null>;

  //variables para la consulta de datos
  tratamientos!: Observable<Tratamiento[]>;
  especialidades!: Observable<String[]>;
  dentistas!: Observable<Dentista[]>;
  tiposTratamientos!: Observable<TipoTratamiento[]>;
  horarios!: Observable<Horario[]>;
  userId!: number;
  citas!: Cita[];
  tiposDocumento!: Observable<TipoDocumento[]>


  //inyeccion de servicios
  tratamientoService = inject(TratamientoService);
  dentistaService = inject(DentistaService);
  horariosService = inject(HorarioService);
  authService = inject(AuthService);
  citaService = inject(CitaService);
  toastService = inject(ToastrService);
  tipoDocumentoService = inject(TipoDocumentoService);
  tipoTratamientoService = inject(TipoTratamientoService);

  //variables para el manejo del calendario
  disabledDates: Date[] = [];
  activeDaysOfWeek: number[] = [];
  selectedDate: string | null = null;
  horarioSelected: Horario | undefined;

  //desde el dia de hoy
  minDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
  maxDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 5, 0));
  minTimeValue: string | undefined = '';
  maxTimeValue: string | undefined = '';

  @ViewChild('stepper') stepper!: StepperComponent;

  //variables para el formulario
  reservaForm: FormGroup;

  desactivarBotonDni = false;
  mostrarBotonDni = false;

  ngOnInit() {
    this.tratamientos = this.tratamientoService.getTratamientos({}, true) as Observable<Tratamiento[]>;
    this.tiposTratamientos = this.tipoTratamientoService.getTipoTratamientos(undefined, undefined, true) as Observable<TipoTratamiento[]>;
    this.especialidades = this.dentistaService.obtenerEspecialidades();
    this.dentistas = this.dentistaService.obtenerDentistas({}, true) as Observable<Dentista[]>;
    this.tiposDocumento = this.tipoDocumentoService.getTiposDocumento({}, true) as Observable<TipoDocumento[]>;
    this.user$ = this.authService.fetchUser();
    this.user$.subscribe((user) => {
      this.userId = user ? user.id : 0
      this.loadCitas();
      console.log(this.userId)
    });

  }

  constructor(private fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef) {
    this.reservaForm = this.fb.group({
      tipo: this.fb.group({
        tipoTratamiento: ['', Validators.required],
        tratamientoId: [{ value: '', disabled: true }, Validators.required],
        especialidad: ['', Validators.required],
        dentistaId: [{ value: '', disabled: true }, Validators.required]
      }),
      horario: this.fb.group({
        fecha: [null, Validators.required],
        hora: [{ value: '', disabled: true }, Validators.required]
      }, { validators: fechaHoraNoPasadaValidator() }),
      paciente: this.fb.group({
        nombres: ['', [Validators.required, soloLetrasValidator]],
        apellidoPaterno: ['', [Validators.required, soloLetrasValidator]],
        apellidoMaterno: ['', [Validators.required, soloLetrasValidator]],
        tipoDocumento: ['', Validators.required],
        numeroIdentidad: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$')]],
        sexo: ['', Validators.required],
        fechaNacimiento: ['', [Validators.required]]
      })
    });
  }
  loadCitas() {
    this.citaService.buscarCitas({
      usuarioId: this.userId,
      estado: 'Pendiente'
    }, true).subscribe({
      next: (response) => {
        this.citas = response as Cita[];
        console.log(this.citas);
      },
      error: (error) => {
        console.log('Error durante la consulta de citas:' + error.message);
        this.toastService.error('Error durante la consulta de citas: ' + error.message);
      }
    });
  }


  obtenerNombresApellidos() {
    this.desactivarBotonDni = true;
    this.authService.getNamesWithReniecService(this.reservaForm.get('paciente')?.get('numeroIdentidad')?.value ?? '').subscribe({
      next: (response) => {
        this.reservaForm.get('paciente')?.get('nombres')?.setValue(response.nombres);
        this.reservaForm.get('paciente')?.get('apellidoPaterno')?.setValue(response.apellidoPaterno);
        this.reservaForm.get('paciente')?.get('apellidoMaterno')?.setValue(response.apellidoMaterno);
      },
      error: (error) => {
        console.log('Error:' + error.message);
        this.toastService.error(error.error.message);
      }
    });
    this.desactivarBotonDni = false;
  }

  convertirDuracionAMinutos(duracionISO: string): number {
    let minutos = 0;
    const match = duracionISO.match(/PT(\d+H)?(\d+M)?/);

    if (match) {
      if (match[1]) {
        minutos += parseInt(match[1]) * 60;
      }
      if (match[2]) {
        minutos += parseInt(match[2]);
      }
    }

    return minutos;
  }

  buscarDentistaPorEspecialidad(event: Event) {
    const target = event.target as HTMLSelectElement;
    const especialidad = target.value;
    const queryparams = {
      especializacion: especialidad
    };
    this.dentistas = this.dentistaService.obtenerDentistas(queryparams, true) as Observable<Dentista[]>;
    this.reservaForm.get('tipo')?.get('dentistaId')?.enable();
  }

  buscarTipoTratamiento(event: Event) {
    const target = event.target as HTMLSelectElement;
    const tipoTratamiento = target.value;
    const queryparams = {
      tipoId: parseInt(tipoTratamiento)
    };
    this.tratamientos = this.tratamientoService.getTratamientos(queryparams, true) as Observable<Tratamiento[]>;
    this.reservaForm.get('tipo')?.get('tratamientoId')?.enable();
  }

  establecerHorariosPorDentista(event: Event) {
    const target = event.target as HTMLSelectElement;
    const dentistaId = target.value;
    const queryparams = {
      dentistaId: parseInt(dentistaId)
    };
    this.horarios = this.horariosService.obtenerHorarios(queryparams);
    this.horarios.subscribe((data) => {
      this.activeDaysOfWeek = this.horariosService.calculateActiveDays(data);
      this.disabledDates = this.horariosService.calculateDisabledDates();
    });
    this.reservaForm.get('horario')?.get('fecha')?.enable();
  }

  handleDateSelected(date: Date) {
    this.reservaForm.get('horario')?.get('fecha')?.reset();
    this.reservaForm.get('horario')?.get('hora')?.reset();
    if (date instanceof Date) {
      const formattedDate = date.toISOString().split('T')[0];
      this.selectedDate = formattedDate;
      this.reservaForm.get('horario')?.get('fecha')?.setValue(formattedDate);
    }
    //obtener el dia de la fecha seleccionada
    let dia = date.toLocaleString('es-ES', { weekday: 'long' })
      .normalize('NFD') // Descompone los caracteres con acento
      .replace(/[\u0300-\u036f]/g, '') // Elimina los diacríticos
      .toUpperCase();
    //filtrar horario por la fecha seleccionada
    const queryparams = {
      dentistaId: this.reservaForm.get('tipo')?.get('dentistaId')?.value,
      dia: dia
    };
    this.horariosService.obtenerHorarios(queryparams).subscribe((horarios) => {
      this.horarioSelected = horarios.find((horario) => horario.dia.toUpperCase() === dia);
      this.minTimeValue = this.horarioSelected?.horaComienzo.substring(0, 5);
      this.maxTimeValue = this.horarioSelected?.horaFin.substring(0, 5);
      console.log(this.minTimeValue, this.maxTimeValue);
      this.reservaForm.get('horario')?.get('hora')?.setValidators([
        Validators.required,
        timeRangeValidator(this.minTimeValue ?? '', this.maxTimeValue ?? '')
      ]);
      this.reservaForm.get('horario')?.get('hora')?.setAsyncValidators(
        citaValidator(
          this.citaService,
          this.reservaForm.get('horario')?.get('fecha')?.value,
          this.reservaForm.get('tipo')?.get('tratamientoId')?.value,
          this.reservaForm.get('tipo')?.get('dentistaId')?.value
        )
      );
    });
    this.reservaForm.get('horario')?.get('hora')?.enable();

  }
  agregarValidadores(event: Event) {
    const target = event.target as HTMLSelectElement;
    const tipoDocumento = target.value;
    const numeroIdentidadControl = this.reservaForm.get('paciente.numeroIdentidad');

    numeroIdentidadControl?.reset();
    numeroIdentidadControl?.clearValidators();

    switch (tipoDocumento) {
      case "DNI":
        this.mostrarBotonDni = true;
        numeroIdentidadControl?.setValidators([
          Validators.required,
          Validators.pattern('^\\d{8}$')
        ]);
        break;
      case "PASAPORTE":
      case "CARNET EXT.":
        this.mostrarBotonDni = false;
        this.reservaForm.get('paciente.nombres')?.setValue('');
        this.reservaForm.get('paciente.apellidoPaterno')?.setValue('');
        this.reservaForm.get('paciente.apellidoMaterno')?.setValue('');
        numeroIdentidadControl?.setValidators([
          Validators.required,
          Validators.pattern('^\\d{12}$')
        ]);
        break;
    }

    numeroIdentidadControl?.updateValueAndValidity();
    numeroIdentidadControl?.enable();
    ['nombres', 'apellidoPaterno', 'apellidoMaterno'].forEach(campo => {
      const control = this.reservaForm.get(`paciente.${campo}`);
      control?.markAsTouched(); // Muy importante para que Angular muestre errores
      control?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });
  }

  guardarReserva() {
    const reservaData = {
      fecha: this.reservaForm.get('horario')?.get('fecha')?.value,
      hora: this.reservaForm.get('horario')?.get('hora')?.value,
      monto: 120.50,
      nombres: this.reservaForm.get('paciente')?.get('nombres')?.value,
      apellidoPaterno: this.reservaForm.get('paciente')?.get('apellidoPaterno')?.value,
      apellidoMaterno: this.reservaForm.get('paciente')?.get('apellidoMaterno')?.value,
      tipoDocumento: this.reservaForm.get('paciente')?.get('tipoDocumento')?.value,
      numeroIdentidad: this.reservaForm.get('paciente')?.get('numeroIdentidad')?.value,
      sexo: this.reservaForm.get('paciente')?.get('sexo')?.value,
      fechaNacimiento: this.reservaForm.get('paciente')?.get('fechaNacimiento')?.value,
      dentistaId: this.reservaForm.get('tipo')?.get('dentistaId')?.value,
      usuarioId: this.userId,
      tratamientoId: this.reservaForm.get('tipo')?.get('tratamientoId')?.value
    };
    console.log(reservaData)
    this.citaService.agregarCita(reservaData).subscribe({
      next: (data) => {
        this.toastService.success("Cita reservada con éxito");
        this.stepper.goToStep(0);
        this.reservaForm.reset();
        this.loadCitas();
      },
      error: (error) => {
        console.error('Error al guardar la reserva:', error);
        this.toastService.error('Error al guardar la reserva: ' + error.mensaje);
      }
    });

  }
  getError(controlPath: string, errorCode: string): boolean | undefined {
    const control = this.reservaForm.get(controlPath);
    return control?.hasError(errorCode) && control?.touched;
  }
  getControl(path: string): AbstractControl | null {
    return this.reservaForm.get(path);
  }

  // Mostrar errores si el campo fue tocado o el formulario se envió
  mostrarError(controlPath: string): boolean {
    const control = this.getControl(controlPath);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

import { Component, inject, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import { isPlatformBrowser } from '@angular/common';
import { Cita } from '../../../shared/interfaces/cita';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, ModalComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  isBrowser: boolean;
  @Input() citas!: Cita[];
  @ViewChild('modal') modal!: ModalComponent;

  trackedCita: Cita | null = null;

  citaEvents: any[] = [];
  toastService = inject(ToastrService);

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (Array.isArray(this.citas)) {
      this.citaEvents = this.citas.map((cita) => {
        const startDateTime = new Date(`${cita.fecha}T${cita.hora}`);

        const match = cita.tratamiento.duracion.match(/PT(\d+)H(\d+)?M?/);
        const hours = match ? parseInt(match[1] || '0', 10) : 0;
        const minutes = match ? parseInt(match[2] || '0', 10) : 0;

        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(endDateTime.getHours() + hours);
        endDateTime.setMinutes(endDateTime.getMinutes() + minutes);

        return {
          title: cita.tratamiento.nombre,
          date: cita.fecha,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          extendedProps: { cita }
        };
      });
      this.calendarOptions.events = this.citaEvents;
    } else {
      console.warn('Valor de "citas" no es un arreglo:', this.citas);
    }
  }


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    themeSystem: 'bootstrap5',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    eventClick: (arg) => this.handleEventClick(arg),
  };

  handleEventClick(arg: any) {
    const cita = arg.event.extendedProps?.cita;

    if (cita) {
      this.trackedCita = cita; // Asigna la cita a la variable rastreada
      this.modal.open();       // Abre el modal
    } else {
      console.error('No se encontró información de la cita en el evento:', arg.event);
    }
  }
}

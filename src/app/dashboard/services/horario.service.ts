import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Horario } from '../../shared/interfaces/horario';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private readonly API_BASE_URL = environment.apiUrl + '/horarios';
  private activeDaysOfWeek: number[] = [];
  private disabledDates: Date[] = [];

  constructor(private http: HttpClient) { }

  /**
   * Fetches a list of schedules, optionally filtered by dentist ID and/or day.
   * @param dentistaId Optional filter by dentist ID.
   * @param dia Optional filter by day of the week (e.g., "LUNES").
   * @returns An Observable emitting a List of HorarioResponse objects.
   */
  obtenerHorarios(
    params: {
      dentistaId?: number,
      dia?: string
    } = {},
  ): Observable<Horario[]> {
    let httpParams = new HttpParams();

    if (params.dentistaId) {
      httpParams = httpParams.set('dentistaId', params.dentistaId.toString());
    }
    if (params.dia) {
      httpParams = httpParams.set('dia', params.dia);
    }

    return this.http.get<Horario[]>(this.API_BASE_URL, { params: httpParams });
  }

  /**
   * Adds a new schedule.
   * @param data The data for the schedule to add.
   * @returns An Observable emitting an object with a success message.
   */
  agregarHorario(data: any): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(this.API_BASE_URL, data);
  }

  /**
   * Deletes a schedule by its ID.
   * @param id The ID of the schedule to delete.
   * @returns An Observable emitting an object with a success message.
   */
  eliminarHorario(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.API_BASE_URL}/${id}`);
  }

  mapDayToNumber(day: string): number | null {
    const daysMap: { [key: string]: number } = {
      lunes: 1,
      martes: 2,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sábado: 6,
      domingo: 0,
    };
    return daysMap[day.toLowerCase()] ?? null;
  }

  calculateActiveDays(horarios: { dia: string }[]): number[] {
    const activeDays = new Set<number>();
    horarios.forEach((horario) => {
      const dayOfWeek = this.mapDayToNumber(horario.dia);
      if (dayOfWeek !== null) {
        activeDays.add(dayOfWeek);
      }
    });

    this.activeDaysOfWeek = Array.from(activeDays);
    return this.activeDaysOfWeek;
  }

  calculateDisabledDates(): Date[] {
    const today = new Date();
    const dates: Date[] = [];

    for (let i = 0; i < 180; i++) {
      const current = new Date(today);
      current.setDate(today.getDate() + i);

      if (!this.activeDaysOfWeek.includes(current.getDay())) {
        dates.push(current);
      }
    }

    this.disabledDates = dates;
    return this.disabledDates;
  }

  getDisabledDates(): Date[] {
    return this.disabledDates;
  }

  getActiveDaysOfWeek(): number[] {
    return this.activeDaysOfWeek;
  }
}

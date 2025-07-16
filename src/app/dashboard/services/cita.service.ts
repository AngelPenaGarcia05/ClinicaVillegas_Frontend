import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cita } from '../../shared/interfaces/cita';
import { Pageable } from '../../shared/interfaces/page';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private readonly API_BASE_URL = environment.apiUrl + '/citas';

  constructor(private http: HttpClient) { }

  /**
   * Busca citas con varios filtros y opciones de paginación.
   * @param params Objeto con los parámetros de búsqueda.
   * @param all Si es true, obtiene todas las citas sin paginación.
   * @param page Número de página (solo si all es false).
   * @param size Tamaño de la página (solo si all es false).
   * @returns Un Observable que emite una Pageable<CitaResponse> si se usa paginación, o List<CitaResponse> si se pide 'all'.
   */
  buscarCitas(
    params: {
      usuarioId?: number;
      dentistaId?: number;
      estado?: string;
      fechaInicio?: string; // Formato YYYY-MM-DD
      fechaFin?: string;    // Formato YYYY-MM-DD
      tratamientoId?: number;
      sexo?: string;
    } = {},
    all: boolean = false,
    page: number = 0,
    size: number = 10
  ): Observable<Pageable<Cita> | Cita[]> {
    let httpParams = new HttpParams();

    if (params.usuarioId) {
      httpParams = httpParams.set('usuarioId', params.usuarioId.toString());
    }
    if (params.dentistaId) {
      httpParams = httpParams.set('dentistaId', params.dentistaId.toString());
    }
    if (params.estado) {
      httpParams = httpParams.set('estado', params.estado);
    }
    if (params.fechaInicio) {
      httpParams = httpParams.set('fechaInicio', params.fechaInicio);
    }
    if (params.fechaFin) {
      httpParams = httpParams.set('fechaFin', params.fechaFin);
    }
    if (params.tratamientoId) {
      httpParams = httpParams.set('tratamientoId', params.tratamientoId.toString());
    }
    if (params.sexo) {
      httpParams = httpParams.set('sexo', params.sexo);
    }

    if (all) {
      httpParams = httpParams.set('all', 'true');
    } else {
      httpParams = httpParams.set('page', page.toString());
      httpParams = httpParams.set('size', size.toString());
    }

    return this.http.get<Pageable<Cita> | Cita[]>(this.API_BASE_URL, { params: httpParams });
  }

  /**
   * Agrega una nueva cita.
   * @param data Los datos de la cita a agregar.
   * @returns Un Observable que completa sin valor (ResponseEntity<Void>).
   */
  agregarCita(data: any): Observable<void> {
    return this.http.post<void>(this.API_BASE_URL, data);
  }

  /**
   * Actualiza una cita existente por su ID.
   * @param id El ID de la cita a actualizar.
   * @param data Los datos actualizados de la cita.
   * @returns Un Observable que completa sin valor (ResponseEntity<Void>).
   */
  actualizarCita(id: number, data: any): Observable<void> {
    return this.http.put<void>(`${this.API_BASE_URL}/${id}`, data);
  }

  /**
   * Marca una cita como "atendida".
   * @param id El ID de la cita a atender.
   * @returns Un Observable que completa sin valor (ResponseEntity<Void>).
   */
  atenderCita(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_BASE_URL}/${id}/atender`, {});
  }

  /**
   * Elimina una cita por su ID.
   * @param id El ID de la cita a eliminar.
   * @returns Un Observable que completa sin valor (ResponseEntity<Void>).
   */
  eliminarCita(id: number, data: any): Observable<void> {
    return this.http.patch<void>(`${this.API_BASE_URL}/${id}/cancelar`, data);
  }

  /**
   * Valida la disponibilidad para una nueva cita.
   * @param data Los datos para validar la disponibilidad.
   * @returns Un Observable que emite true si está disponible, false si no.
   */
  validarDisponibilidad(data: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.API_BASE_URL}/validar-disponibilidad`, data);
  }

  /**
   * Reprograma una cita existente.
   * @param id El ID de la cita a reprogramar.
   * @param data Los datos con la nueva fecha de la cita.
   * @returns Un Observable que completa sin valor (ResponseEntity<Void>).
   */
  reprogramarCita(id: number, data: any): Observable<void> {
    return this.http.patch<void>(`${this.API_BASE_URL}/${id}/reprogramar`, data);
  }
}

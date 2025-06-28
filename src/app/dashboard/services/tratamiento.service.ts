import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pageable } from '../../shared/interfaces/page';
import { Tratamiento } from '../../shared/interfaces/tratamiento';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TratamientoService {
  private readonly API_BASE_URL = environment.apiUrl + '/tratamientos';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene una lista de tratamientos, con o sin paginación y filtros.
   * @param tipoId Filtro opcional por ID de tipo de tratamiento.
   * @param nombre Filtro opcional por nombre del tratamiento.
   * @param estado Filtro opcional por estado activo/inactivo.
   * @param all Si es true, obtiene todos los tratamientos sin paginación.
   * @param page Número de página (solo si all es false).
   * @param size Tamaño de la página (solo si all es false).
   * @returns Un Observable que emite una Page<Tratamiento> si se usa paginación, o List<Tratamiento> si se pide 'all'.
   */
  getTratamientos(
    params: {
      tipoId?: number,
      nombre?: string,
      estado?: boolean
    } = {},
    all: boolean = false,
    page: number = 0,
    size: number = 10
  ): Observable<Pageable<Tratamiento> | Tratamiento[]> {
    let httpParams = new HttpParams();

    if (params.tipoId) {
      httpParams = httpParams.set('tipo', params.tipoId.toString());
    }
    if (params.nombre) {
      httpParams = httpParams.set('nombre', params.nombre);
    }
    if (params.estado !== undefined && params.estado !== null) {
      httpParams = httpParams.set('estado', params.estado.toString());
    }
    if (all) {
      httpParams = httpParams.set('all', 'true');
    } else {
      httpParams = httpParams.set('page', page.toString());
      httpParams = httpParams.set('size', size.toString());
    }

    return this.http.get<Pageable<Tratamiento> | Tratamiento[]>(this.API_BASE_URL, { params: httpParams });
  }

  /**
   * Obtiene un tratamiento por su ID.
   * @param id El ID del tratamiento.
   * @returns Un Observable que emite el objeto Tratamiento.
   */
  getTratamientoById(id: number): Observable<Tratamiento> {
    return this.http.get<Tratamiento>(`${this.API_BASE_URL}/${id}`);
  }

  /**
   * Crea un nuevo tratamiento.
   * @param data Los datos del tratamiento a crear.
   * @returns Un Observable que emite un mensaje de éxito.
   */
  createTratamiento(data: any): Observable<string> {
    return this.http.post(this.API_BASE_URL, data, { responseType: 'text' });
  }

  /**
   * Actualiza un tratamiento existente por su ID.
   * @param id El ID del tratamiento a actualizar.
   * @param data Los datos actualizados del tratamiento.
   * @returns Un Observable que emite un mensaje de éxito.
   */
  updateTratamiento(id: number, data: any): Observable<string> {
    return this.http.put(`${this.API_BASE_URL}/${id}`, data, { responseType: 'text' });
  }

  /**
   * Elimina un tratamiento por su ID.
   * @param id El ID del tratamiento a eliminar.
   * @returns Un Observable que emite un mensaje de éxito.
   */
  deleteTratamiento(id: number): Observable<string> {
    return this.http.delete(`${this.API_BASE_URL}/${id}`, { responseType: 'text' });
  }
}

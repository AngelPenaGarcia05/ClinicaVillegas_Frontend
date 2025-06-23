import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Pageable } from '../../shared/interfaces/page';
import { TipoTratamiento } from '../../shared/interfaces/tipo-tratamiento';

@Injectable({
  providedIn: 'root'
})
export class TipoTratamientoService {
  private readonly API_BASE_URL = environment.apiUrl + '/tipo-tratamiento';

  constructor(private http: HttpClient) { }

  /**
   * Fetches a list of treatment types, with or without pagination and filters.
   * @param nombre Optional filter by treatment type name.
   * @param estado Optional filter by status (true for active, false for inactive). Defaults to true.
   * @param all If true, fetches all treatment types without pagination.
   * @param page Page number (only if all is false).
   * @param size Page size (only if all is false).
   * @returns An Observable emitting a Page<TipoTratamiento> if paginated, or List<TipoTratamiento> if 'all' is true.
   */
  getTipoTratamientos(
    nombre?: string,
    estado: boolean = true, // Default to true as per your controller
    all: boolean = false,
    page: number = 0,
    size: number = 10
  ): Observable<Pageable<TipoTratamiento> | TipoTratamiento[]> {
    let params = new HttpParams();

    if (nombre) {
      params = params.set('nombre', nombre);
    }
    // Only add 'estado' if it's explicitly false, or if it's not the default 'true' AND 'all' is false.
    if (estado !== true) {
      params = params.set('estado', estado.toString());
    }

    if (all) {
      params = params.set('all', 'true');
    } else {
      params = params.set('page', page.toString());
      params = params.set('size', size.toString());
    }

    return this.http.get<Pageable<TipoTratamiento> | TipoTratamiento[]>(this.API_BASE_URL, { params });
  }

  /**
   * Adds a new treatment type.
   * @param data The data for the treatment type to add.
   * @returns An Observable emitting an object with a success message.
   */
  agregarTipoTratamiento(data: any): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(this.API_BASE_URL, data);
  }

  /**
   * Updates an existing treatment type by its ID.
   * @param id The ID of the treatment type to update.
   * @param data The updated treatment type data.
   * @returns An Observable emitting an object with a success message.
   */
  actualizarTipoTratamiento(id: number, data: any): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.API_BASE_URL}/${id}`, data);
  }

  /**
   * Deletes a treatment type by its ID.
   * @param id The ID of the treatment type to delete.
   * @returns An Observable emitting an object with a success message.
   */
  eliminarTipoTratamiento(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.API_BASE_URL}/${id}`);
  }
}

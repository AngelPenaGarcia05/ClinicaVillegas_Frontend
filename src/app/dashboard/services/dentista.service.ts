import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Pageable } from '../../shared/interfaces/page';
import { Dentista } from '../../shared/interfaces/dentista';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DentistaService {
  private readonly API_BASE_URL = environment.apiUrl + '/dentistas';

  constructor(private http: HttpClient) { }
  /**
   * Obtiene una lista de dentistas, con o sin paginación y filtros.
   * @param params Objeto con los parámetros de búsqueda.
   * @param all Si es true, obtiene todos los dentistas sin paginación.
   * @param page Número de página (solo si all es false).
   * @param size Tamaño de la página (solo si all es false).
   * @returns Un Observable que emite una Page<DentistaResponse> si se usa paginación, o List<DentistaResponse> si se pide 'all'.
   */
  obtenerDentistas(
    params: {
      nombre?: string,
      especializacion?: string,
      usuarioId?: number,
    } = {},
    all: boolean = false,
    page: number = 0,
    size: number = 10
  ): Observable<Pageable<Dentista> | Dentista[]> {
    let httpParams = new HttpParams();

    if (params.nombre) {
      httpParams = httpParams.set('nombre', params.nombre);
    }
    if (params.especializacion) {
      httpParams = httpParams.set('especializacion', params.especializacion);
    }
    if (params.usuarioId) {
      httpParams = httpParams.set('usuarioId', params.usuarioId.toString());
    }
    if (all) {
      httpParams = httpParams.set('all', 'true');
    } else {
      httpParams = httpParams.set('page', page.toString());
      httpParams = httpParams.set('size', size.toString());
    }

    return this.http.get<Pageable<Dentista> | Dentista[]>(this.API_BASE_URL, { params: httpParams });
  }

  /**
   * Obtiene la lista de especialidades de los dentistas.
   * @returns Un Observable que emite una lista de cadenas (especialidades).
   */
  obtenerEspecialidades(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_BASE_URL}/especialidades`);
  }

  /**
   * Agrega un nuevo dentista.
   * @param data La información del dentista a agregar.
   * @returns Un Observable que emite un objeto con un mensaje de éxito.
   */
  agregarDentista(data: any): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(this.API_BASE_URL, data);
  }

  /**
   * Actualiza un dentista existente por su ID.
   * @param id El ID del dentista a actualizar.
   * @param data La información actualizada del dentista.
   * @returns Un Observable que emite un objeto con un mensaje de éxito.
   */
  actualizarDentista(id: number, data: any): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.API_BASE_URL}/${id}`, data);
  }

  /**
   * Elimina un dentista por su ID.
   * @param id El ID del dentista a eliminar.
   * @returns Un Observable que emite un objeto con un mensaje de éxito.
   */
  eliminarDentista(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.API_BASE_URL}/${id}`);
  }
}

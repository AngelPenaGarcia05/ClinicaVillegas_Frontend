import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pageable } from '../../shared/interfaces/page';
import { TipoDocumento } from '../../shared/interfaces/tipo-documento';


@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {
  
  private readonly API_BASE_URL = environment.apiUrl + '/tipo-documento';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene una lista de tipos de documento, con o sin paginación y filtros.
   * @param nombre Filtro opcional por nombre del tipo de documento.
   * @param acronimo Filtro opcional por acrónimo del tipo de documento.
   * @param all Si es true, obtiene todos los tipos de documento sin paginación.
   * @param page Número de página (solo si all es false).
   * @param size Tamaño de la página (solo si all es false).
   * @returns Un Observable que emite una Page<TipoDocumento> si se usa paginación, o List<TipoDocumento> si se pide 'all'.
   */
  getTiposDocumento(
    params: {
      nombre?: string,
      acronimo?: string
    } = {},
    all: boolean = false,
    page: number = 0,
    size: number = 10
  ): Observable<Pageable<TipoDocumento> | TipoDocumento[]> {
    let httpParams = new HttpParams();

    if (params.nombre) {
      httpParams = httpParams.set('nombre', params.nombre);
    }
    if (params.acronimo) {
      httpParams = httpParams.set('acronimo', params.acronimo);
    }
    if (all) {
      httpParams = httpParams.set('all', 'true');
    } else {
      httpParams = httpParams.set('page', page.toString());
      httpParams = httpParams.set('size', size.toString());
    }

    return this.http.get<Pageable<TipoDocumento> | TipoDocumento[]>(this.API_BASE_URL, { params: httpParams });
  }

  /**
   * Obtiene un tipo de documento por su ID.
   * @param id El ID del tipo de documento.
   * @returns Un Observable que emite el objeto TipoDocumento.
   */
  obtenerTipoDocumento(id: number): Observable<TipoDocumento> {
    return this.http.get<TipoDocumento>(`${this.API_BASE_URL}/${id}`);
  }

  /**
   * Agrega un nuevo tipo de documento.
   * @param tipoDocumentoRequest Los datos del tipo de documento a agregar.
   * @returns Un Observable que emite un objeto con un mensaje de éxito.
   */
  agregarTipoDocumento(data: any): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(this.API_BASE_URL, data);
  }

  /**
   * Actualiza un tipo de documento existente por su ID.
   * @param id El ID del tipo de documento a actualizar.
   * @param data Los datos actualizados del tipo de documento.
   * @returns Un Observable que emite un objeto con un mensaje de éxito.
   */
  actualizarTipoDocumento(id: number, data: any): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.API_BASE_URL}/${id}`, data);
  }

  /**
   * Elimina un tipo de documento por su ID.
   * @param id El ID del tipo de documento a eliminar.
   * @returns Un Observable que emite un objeto con un mensaje de éxito.
   */
  eliminarTipoDocumento(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.API_BASE_URL}/${id}`);
  }
}

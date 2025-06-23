import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pageable } from '../../shared/interfaces/page';
import { Usuario } from '../../shared/interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly API_BASE_URL = environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient) { }

  /**
   * Fetches a list of users, with or without pagination and filters.
   * @param nombres Optional filter by user names.
   * @param rol Optional filter by user role.
   * @param estado Optional filter by user status (true for active, false for inactive).
   * @param all If true, fetches all users without pagination.
   * @param page Page number (only if all is false).
   * @param size Page size (only if all is false).
   * @returns An Observable emitting a Page<UsuarioResponse> if paginated, or List<UsuarioResponse> if 'all' is true.
   */
  getUsuarios(
    params: {
      nombres?: string,
      rol?: string,
      estado: boolean
    } = { estado: true },
    all: boolean = false,
    page: number = 0,
    size: number = 10
  ): Observable<Pageable<Usuario> | Usuario[]> {
    let httpParams = new HttpParams();

    if (params.nombres) {
      httpParams = httpParams.set('nombres', params.nombres);
    }
    if (params.rol) {
      httpParams = httpParams.set('rol', params.rol);
    }
    if (params.estado !== true) {
      httpParams = httpParams.set('estado', params.estado.toString());
    }
    if (all) {
      httpParams = httpParams.set('all', 'true');
    } else {
      httpParams = httpParams.set('page', page.toString());
      httpParams = httpParams.set('size', size.toString());
    }

    return this.http.get<Pageable<Usuario> | Usuario[]>(this.API_BASE_URL, { params: httpParams });
  }

  /**
   * Fetches a single user by their ID.
   * @param id The ID of the user to retrieve.
   * @returns An Observable emitting the UsuarioResponse object.
   */
  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_BASE_URL}/${id}`);
  }

  /**
   * Updates an existing user by their ID.
   * @param id The ID of the user to update.
   * @param data The updated user data.
   * @returns An Observable emitting an object with a success message.
   */
  actualizarUsuario(id: number, data: any): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.API_BASE_URL}/${id}`, data);
  }

  /**
   * Logically deletes a user by their ID (sets their status to inactive).
   * @param id The ID of the user to delete.
   * @returns An Observable emitting an object with a success message.
   */
  eliminarUsuario(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.API_BASE_URL}/${id}`);
  }
}

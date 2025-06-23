import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Pageable } from '../../shared/interfaces/page';
import { Dentista } from '../interfaces/dentista';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DentistaService {
  private readonly API_BASE_URL = environment.apiUrl + '/dentistas';

  constructor(private http: HttpClient) { }

  obtenerDentistas(
    nombre?: string,
    especializacion?: string,
    usuarioId?: number,
    all: boolean = false,
    page: number = 0,
    size: number = 10
  ): Observable<Pageable<Dentista> | Dentista[]> {
    let params = new HttpParams();

    if (nombre) {
      params = params.set('nombre', nombre);
    }
    if (especializacion) {
      params = params.set('especializacion', especializacion);
    }
    if (usuarioId) {
      params = params.set('usuarioId', usuarioId.toString());
    }
    if (all) {
      params = params.set('all', 'true');
    } else {
      params = params.set('page', page.toString());
      params = params.set('size', size.toString());
    }

    return this.http.get<Pageable<Dentista> | Dentista[]>(this.API_BASE_URL, { params });
  }

  obtenerEspecialidades(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_BASE_URL}/especialidades`);
  }

  agregarDentista(data: any): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(this.API_BASE_URL, data);
  }

  actualizarDentista(id: number, data: any): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.API_BASE_URL}/${id}`, data);
  }

  eliminarDentista(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.API_BASE_URL}/${id}`);
  }
}

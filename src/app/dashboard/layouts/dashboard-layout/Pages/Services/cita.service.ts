import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cita } from '../Interfaces/Cita';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private baseUrl = environment.apiUrl + 'citas';

  constructor(private http: HttpClient) { }

  getCitas(params: {
    usuarioId: number,
    page?: number,
    size?: number
  }): Observable<{ content: Cita[], totalPages: number, totalElements: number, number: number }> {
    return this.http.get<any>(`/api/citas`, {
      params: {
        usuarioId: params.usuarioId,
        page: params.page?.toString() || '0',
        size: params.size?.toString() || '10'
      }
    });
  }

}

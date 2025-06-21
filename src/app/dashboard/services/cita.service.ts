import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Cita } from '../interfaces/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private baseUrl = environment.apiUrl + '/citas';

  constructor(private http: HttpClient) { }

  getCitas(params: {
    usuarioId: number,
    page?: number,
    size?: number
  }): Observable<{ content: Cita[], totalPages: number, totalElements: number, number: number }> {
    return this.http.get<any>(this.baseUrl, {
      params: {
        usuarioId: params.usuarioId,
        page: params.page?.toString() || '0',
        size: params.size?.toString() || '10'
      }
    });
  }

}

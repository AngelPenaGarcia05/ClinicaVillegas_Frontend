import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Cita } from '../interfaces/cita';
import { Pageable } from '../../shared/interfaces/page';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private baseUrl = environment.apiUrl + '/citas';

  constructor(private http: HttpClient) { }

  getCitas(params: {
    usuarioId?: number,
    dentistaId?: number,
    estado?: string,
    fechaInicio?: string,
    fechaFin?: string,
    tratamientoId?: number,
    sexo?: string,
    page?: number,
    size?: number
  }): Observable<Pageable<Cita>> {
    const httpParams: any = {};

    if (params.usuarioId != null) httpParams['usuarioId'] = params.usuarioId;
    if (params.dentistaId != null) httpParams['dentistaId'] = params.dentistaId;
    if (params.estado != null) httpParams['estado'] = params.estado;
    if (params.fechaInicio != null) httpParams['fechaInicio'] = params.fechaInicio;
    if (params.fechaFin != null) httpParams['fechaFin'] = params.fechaFin;
    if (params.tratamientoId != null) httpParams['tratamientoId'] = params.tratamientoId;
    if (params.sexo != null) httpParams['sexo'] = params.sexo;

    httpParams['page'] = params.page?.toString() || '0';
    httpParams['size'] = params.size?.toString() || '10';

    return this.http.get<any>(this.baseUrl, { params: httpParams });
  }

  createCita(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  deleteCita(id: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/' + id);
  }

  successCita(id: number): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/atender/' + id, {});
  }

  editCita(citaId: number, data: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/reprogramar/' + citaId, data);
  }

}

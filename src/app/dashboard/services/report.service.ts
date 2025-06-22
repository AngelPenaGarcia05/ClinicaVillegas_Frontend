import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ReporteRequestDTO } from '../interfaces/reporte-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly API_URL = environment.apiUrl + '/reportes';

  constructor(private http: HttpClient) {}

  generarReporte(dto: ReporteRequestDTO): Observable<any[]> {
    return this.http.post<any[]>(this.API_URL, dto);
  }
  descargarPdf(dto: ReporteRequestDTO): Observable<Blob> {
    return this.http.post(`${this.API_URL}/pdf`, dto, {responseType: 'blob'});
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ReporteRequestDTO } from '../interfaces/reporte-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly API_URL = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient) {}

  generarReporte(dto: ReporteRequestDTO): Observable<any[]> {
    return this.http.post<any[]>(this.API_URL, dto);
  }
}

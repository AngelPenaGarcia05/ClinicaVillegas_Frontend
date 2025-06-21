// comentario.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comentario } from '../interfaces/comentario';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  constructor(private http: HttpClient) {}

  getComentarios(page: number = 0, size: number = 5): Observable<{
    content: Comentario[],
    totalPages: number,
    totalElements: number,
    number: number
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${environment.apiUrl}comentarios`, { params });
  }

  createComentario(contenido: string, usuarioId: number, comentarioId: number | null): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}comentarios`, {
      contenido,
      usuarioId,
      comentarioId
    });
  }
}

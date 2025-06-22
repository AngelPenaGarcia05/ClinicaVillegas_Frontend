import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../../shared/interfaces/usuario';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../interfaces/login-request';
import { RegisterRequest } from '../interfaces/register-request';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly BASE_PATH = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.BASE_PATH}/login`, data).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  register(data: RegisterRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.BASE_PATH}/register`, data).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.BASE_PATH}/logout`, {}).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }

  fetchUser(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.BASE_PATH}/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }
  refreshAccessToken(): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.BASE_PATH}/refresh`, {}).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }
  getNamesWithReniecService(documento: string): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/reniec', {
      params: {
        dni: documento
      }
    });
  }

  getDentistaId(): any {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      console.log('Token cargado correctamente:', token); // Verifica si el token está en localStorage

      if (token) {
        const decodedToken: any = jwtDecode(token);
        console.log('Token decodificado:', decodedToken); // Verifica el contenido del token
        return decodedToken.dentistaId;
      }
    }
    console.error('Token no disponible en localStorage o error al cargarlo.');
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}

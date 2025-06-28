import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { Usuario } from '../../shared/interfaces/usuario';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../interfaces/login-request';
import { RegisterRequest } from '../interfaces/register-request';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly BASE_PATH = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private initialized = false;

  constructor(private http: HttpClient) { }

  initUser(): void {
    if (this.initialized) return;

    this.initialized = true;
    this.fetchUser().subscribe();
  }

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

  fetchUser(): Observable<Usuario | null> {
  return this.http.get<Usuario>(`${this.BASE_PATH}/me`, { withCredentials: true }).pipe(
    tap(user => this.currentUserSubject.next(user)),
    catchError(() => {
      this.currentUserSubject.next(null);
      return of(null);
    })
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

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}

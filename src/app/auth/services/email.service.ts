import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmailRequest {
  to: string;
  subject: string;
  body: string;
}

export interface CodeRequest {
  email: string;
}

export interface CodeResponse {
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private baseUrl = environment.apiUrl + '/email';

  constructor(private http: HttpClient) { }

  sendEmail(request: EmailRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/sendemail`, request);
  }

  sendCode(request: CodeRequest): Observable<CodeResponse> {
    return this.http.post<CodeResponse>(`${this.baseUrl}/sendcode`, request);
  }
}

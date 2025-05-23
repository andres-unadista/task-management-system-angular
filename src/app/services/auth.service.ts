import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://app-movies-api.test/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const credentials: UserCredentials = { email, password };
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        // Store token or user data if needed
        return response;
      })
    );
  }

  register(user: UserRegistration): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      map((response: any) => {
        // Store token or user data if needed
        return response;
      })
    );
  }

  logout(): void {
    // Implement logout logic if needed
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthRequest {
  status: string;
  token: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
}

interface ResponseToken {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private apiUrl = 'http://app-movies-api.test/api';

  constructor(private http: HttpClient) {}

  login(credentials: UserCredentials): Observable<ResponseToken> {
    return this.http.post<ResponseToken>(`${this.apiUrl}/login`, credentials).pipe(map((response: ResponseToken) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.access_token);
      }
      return response;
    }));
  }

  register(user: UserRegistration): Observable<AuthRequest> {
    return this.http.post<AuthRequest>(`${this.apiUrl}/register`, user).pipe(
      map((response: AuthRequest) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
        }
        return response
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  role: string;
  permissions: string[];
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private loginStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  loginStatusChanged = this.loginStatus.asObservable();

  constructor(private http: HttpClient) {}


  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }


  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        if (response.success && response.data?.token) {
          localStorage.setItem('token', response.data.token);
          this.loginStatus.next(true);
        }
      }),
      catchError((error) => {
        console.error('Greška prilikom prijave:', error);
        return throwError(() => new Error('Greška prilikom prijave.'));
      })
    );
  }


  logout(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.loginStatus.next(false);
      }),
      catchError((error) => {
        console.error('Greška prilikom odjave:', error);
        return throwError(() => new Error('Greška prilikom odjave.'));
      })
    );
  }


  resetPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/reset-password`, { email }, { headers }).pipe(
      tap(() => console.log('Email za reset lozinke poslat.')),
      catchError((error) => {
        console.error('Greška prilikom resetovanja lozinke:', error);
        return throwError(() => new Error('Greška prilikom resetovanja lozinke.'));
      })
    );
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }


  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<DecodedToken>(token);
      } catch (error) {
        console.error('Neuspešno parsiranje JWT tokena:', error);
        return null;
      }
    }
    return null;
  }


  getUserId(): number | null {
    const decoded = this.getDecodedToken();
    return decoded?.id ?? null;
  }


  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role ?? null;
  }


  getUserPermissions(): string[] {
    const decoded = this.getDecodedToken();
    return decoded?.permissions ?? [];
  }


  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (decoded?.exp) {
      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate < new Date();
    }
    return true;
  }


  refreshToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/refresh-token`).pipe(
      tap((response: any) => {
        if (response.success && response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }
      }),
      catchError((error) => {
        console.error('Greška prilikom osvežavanja tokena:', error);
        return throwError(() => new Error('Greška prilikom osvežavanja tokena.'));
      })
    );
  }
}

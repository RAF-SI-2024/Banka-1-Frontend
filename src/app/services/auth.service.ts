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

  // Provera da li je korisnik prijavljen
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token && !this.isTokenExpired()) {
      return true;
    }
    this.logout(); // Ako je token istekao, automatski briše podatke
    return false;
  }

  // Prijava korisnika
  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.apiUrl}/login`, credentials, { headers }).pipe(
        tap((response: any) => {
          const token = response?.data?.token;
          if (response.success && token) {
            localStorage.setItem('token', token);
            this.loginStatus.next(true);
          }
        }),
        catchError((error) => {
          console.error('Greška prilikom prijave:', error);
          return throwError(() => new Error('Neuspešna prijava. Proverite email i lozinku.'));
        })
    );
  }

  // Odjava korisnika
  logout(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
        tap(() => {
          localStorage.removeItem('token');
          this.loginStatus.next(false);
        }),
        catchError((error) => {
          console.error('Greška prilikom odjave:', error);
          return throwError(() => new Error('Neuspešna odjava.'));
        })
    );
  }


  // Resetovanje lozinke
  resetPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/reset-password`, { email }, { headers }).pipe(
        tap(() => console.log('Email za reset lozinke poslat.')),
        catchError((error) => {
          console.error('Greška prilikom resetovanja lozinke:', error);
          return throwError(() => new Error('Neuspešno resetovanje lozinke.'));
        })
    );
  }

  // Dohvatanje tokena
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Parsiranje JWT tokena
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

  // Dobijanje ID korisnika
  getUserId(): number | null {
    return this.getDecodedToken()?.id ?? null;
  }

  // Dobijanje uloge korisnika
  getUserRole(): string | null {
    return this.getDecodedToken()?.role ?? null;
  }

  // Dobijanje permisija korisnika
  getUserPermissions(): string[] {
    return this.getDecodedToken()?.permissions ?? [];
  }

  // Provera da li je token istekao
  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (decoded?.exp) {
      const expirationDate = new Date(decoded.exp * 1000);
      const now = new Date();
      return expirationDate < now;
    }
    return true;
  }

  // Osvežavanje tokena
  refreshToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/refresh-token`).pipe(
        tap((response: any) => {
          const newToken = response?.data?.token;
          if (response.success && newToken) {
            localStorage.setItem('token', newToken);
          }
        }),
        catchError((error) => {
          console.error('Greška prilikom osvežavanja tokena:', error);
          return throwError(() => new Error('Neuspešno osvežavanje tokena.'));
        })
    );
  }

  changePassword(newPassword: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { password: newPassword, token: token };

    return this.http.post(`${this.apiUrl}/change-password`, body, { headers }).pipe(
        tap(() => console.log('Lozinka uspešno promenjena.')),
        catchError((error) => {
          console.error('Greška prilikom promene lozinke:', error);
          return throwError(() => new Error('Neuspešna promena lozinke.'));
        })
    );
  }

}

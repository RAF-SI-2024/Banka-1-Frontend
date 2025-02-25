// src/app/services/test-auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TestAuthService {
  private testUser = {
    email: 'test@example.com',
    password: 'Test1234!',
    id: 1,
    role: 'user',
    permissions: ['user.read', 'user.write']
  };

  private loginStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  loginStatusChanged = this.loginStatus.asObservable();

  constructor() {}

  // Provera da li je korisnik prijavljen
  isLoggedIn(): boolean {
    return !!localStorage.getItem('test-token');
  }

  // Simulacija prijave korisnika
  login(credentials: { email: string; password: string }): Observable<any> {
    if (
      credentials.email === this.testUser.email &&
      credentials.password === this.testUser.password
    ) {
      const fakeToken = btoa(JSON.stringify(this.testUser)); // Simulirani JWT token
      localStorage.setItem('test-token', fakeToken);
      this.loginStatus.next(true);
      return of({ success: true, token: fakeToken });
    } else {
      return throwError(() => new Error('Neuspešna prijava. Proverite email i lozinku.'));
    }
  }

  // Simulacija resetovanja lozinke
  resetPassword(email: string): Observable<any> {
    if (email === this.testUser.email) {
      return of({ success: true, message: 'Link za reset lozinke poslat na email.' });
    } else {
      return throwError(() => new Error('Korisnik sa tim email-om ne postoji.'));
    }
  }

  // Simulacija promene lozinke
  changePassword(newPassword: string): Observable<any> {
    this.testUser.password = newPassword;
    return of({ success: true, message: 'Lozinka uspešno promenjena.' });
  }

  // Simulacija odjave
  logout(): void {
    localStorage.removeItem('test-token');
    this.loginStatus.next(false);
  }

  // Dohvatanje tokena
  getToken(): string | null {
    return localStorage.getItem('test-token');
  }

  // Parsiranje tokena
  getDecodedToken(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        return JSON.parse(atob(token));
      } catch (error) {
        console.error('Neuspešno parsiranje testnog tokena:', error);
        return null;
      }
    }
    return null;
  }

  // Dobijanje uloge korisnika
  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role ?? null;
  }
}

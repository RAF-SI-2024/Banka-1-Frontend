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
      const fakeToken = this.generateToken(this.testUser.email);
      localStorage.setItem('test-token', fakeToken);
      this.loginStatus.next(true);
      return of({ success: true, token: fakeToken });
    } else {
      return throwError(() => new Error('Neuspešna prijava. Proverite email i lozinku.'));
    }
  }

  // Generisanje lažnog tokena (base64)
  private generateToken(email: string): string {
    const payload = {
      email: email,
      exp: Math.floor(Date.now() / 1000) + 3600 // Token važi 1 sat
    };
    return btoa(JSON.stringify(payload));
  }

  // Simulacija resetovanja lozinke - generiše token za reset
  resetPassword(email: string): Observable<any> {
    if (email === this.testUser.email) {
      const resetToken = this.generateToken(email);
      return of({ success: true, resetToken });
    } else {
      return throwError(() => new Error('Korisnik sa tim email-om ne postoji.'));
    }
  }

  // Simulacija promene lozinke uz token
  changePassword(data: { token: string; newPassword: string }): Observable<any> {
    const decodedToken = this.decodeToken(data.token);
    if (decodedToken && decodedToken.email === this.testUser.email) {
      this.testUser.password = data.newPassword;
      return of({ success: true, message: 'Lozinka uspešno promenjena.' });
    } else {
      return throwError(() => new Error('Neispravan ili istekao token.'));
    }
  }

  // Odjava korisnika
  logout(): void {
    localStorage.removeItem('test-token');
    this.loginStatus.next(false);
  }

  // Dohvatanje tokena
  getToken(): string | null {
    return localStorage.getItem('test-token');
  }

  // Parsiranje tokena
  private decodeToken(token: string): any | null {
    try {
      return JSON.parse(atob(token));
    } catch (error) {
      console.error('❌ Neuspešno parsiranje tokena:', error);
      return null;
    }
  }

  // Dobijanje uloge korisnika
  getUserRole(): string | null {
    const token = this.getToken();
    const decoded = token ? this.decodeToken(token) : null;
    return decoded?.role ?? null;
  }

  // Provera da li je token istekao
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (decoded?.exp) {
      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate < new Date();
    }
    return true;
  }
}

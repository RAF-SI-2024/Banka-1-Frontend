import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // URL backend API-ja
  //AKO JE POGRESAN ISPRAVITI

  private userPermissions: string[] = []; //lokalno cuvanje permisija
  private userId!: bigint;
  private userRole!: string;

  private loginStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  loginStatusChanged = this.loginStatus.asObservable();

  constructor(private http: HttpClient) {}

  //provera autentifikacije
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); //da li postoji token
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/api/auth/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.jwt); //cuvanje JWT-a
        this.loginStatus.next(true);
      }),
      catchError((error) => {
        console.error('Greska u servisu za prijavu:', error);
        return throwError(() => error);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/api/auth/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('token'); // uklanjanje JWT-a
        this.loginStatus.next(false);      // azuriranje statusa prijave
      }),
      catchError((error) => {
        console.error('Greska u servisu za odjavu:', error);
        return throwError(() => error);
      })
    );
  }


  getUsers() {
    return this.http.get('/api/users'); // API poziv za dobavljanje svih korisnika
  }

}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../environments/environment";
//import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.api}/users`;

  constructor(
    private http: HttpClient,
   // private authservice: AuthService
  ) {}

  createEmployee(employeeData: any): Observable<any> {
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/employees`, employeeData, { headers });
  }

  createCustomer(customerData: any): Observable<any> {
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/customers`, customerData, { headers });
  }

}

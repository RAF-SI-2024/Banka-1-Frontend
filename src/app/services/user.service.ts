import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import {environment} from "../environments/environment";
//import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private aiUrl = `${environment.api}/users`;

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

    return this.http.post(`http://localhost:8080/api/users/employees`, employeeData, { headers });
  }

  createCustomer(customerData: any): Observable<any> {
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`http://localhost:8080/api/users/customers`, customerData, { headers });
  }


  fetchEmployees(): Observable<{ employees: Employee[]; total: number }> {
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.get<{ success: boolean; data: { rows: Employee[]; total: number } }>(`${this.aiUrl}/search/employees`, { headers }
    ).pipe(
      map(response => ({
        employees: response.data.rows,
        total: response.data.total
      }))
    );
  }

  fetchCustomers(): Observable<{ customers: Customer[]; total: number }> {
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.get<{ success: boolean; data: { rows: Customer[]; total: number } }>(`${this.aiUrl}/search/customers`, { headers }
    ).pipe(
      map(response => ({
        customers: response.data.rows,
        total: response.data.total
      }))
    );
  }

  deleteEmployee(id: number): Observable<void> {
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.delete<void>(`${this.aiUrl}/search/employee${id}`, { headers });
  }

  deleteCustumer(id: number): Observable<void> {
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.delete<void>(`${this.aiUrl}/search/customer${id}`, { headers });
  }

  updateEmployee(id: number, employeeData: Partial<Employee>): Observable<void> {
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.put<void>(`${this.aiUrl}/search/employee/${id}`, employeeData, { headers });
  }

  updateCustomer(id: number, customerData: Partial<Customer>): Observable<void> {
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<void>(`${this.aiUrl}/search/customer/${id}`, customerData, { headers });
  }

  updateEmployeePermissions(id: number, permissions: string[]): Observable<void> {
    const body = { permissions };
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<void>(`${this.aiUrl}/search/employee/${id}/permissions`, body, { headers });
  }

  updateCustomerPermissions(id: number, permissions: string[]): Observable<void> {
    const body = { permissions };
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<void>(`${this.aiUrl}/search/customer/${id}/permissions`, body, { headers });
  }




}


export interface Customer {
  id: number;
  ime: string;
  prezime: string;
  datumRodjenja: number;
  pol: string;
  email: string;
  brojTelefona: string;
  adresa: string;
  password: string;
  saltPassword: string;
  povezaniRacuni: string[];
  pozicija: null;
  aktivan: null;
  permissions: string[];
}


export interface Employee {
  id: number;
  ime: string;
  prezime: string;
  datumRodjenja: number;
  pol: string;
  email: string;
  brojTelefona: string;
  adresa: string;
  username: string;
  password: string;
  saltPassword: string;
  pozicija: string;
  departman: string;
  aktivan: boolean;
  permissions: string[];
}



import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../environments/environment";
//import { AuthService } from './auth.service';

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

    return this.http.post(`${this.aiUrl}/employees`, employeeData, { headers });
  }

  createCustomer(customerData: any): Observable<any> {
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.aiUrl}/customers`, customerData, { headers });
  }

}

//   constructor(private http: HttpClient) {}

  fetchData(activeCategory: string, currentPage: number, itemsPerPage: number, totalItems: number, totalPages: number, displayedData: (Employee | Customer)[]) {
    const apiUrl = activeCategory === 'employees'
      ? 'http://localhost:8080/api/users/employees'
      : 'http://localhost:8080/api/users/customers';

    this.http.get<any>(`${apiUrl}?page=${currentPage}&limit=${itemsPerPage}`).subscribe({
      next: (data) => {
        totalItems = data.totalItems;
        totalPages = Math.ceil(totalItems / itemsPerPage);
        displayedData = data.items;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }

  fetchEmployees(employees: Employee[], activeCategory: string, displayedData: (Employee | Customer)[]) {
    this.http.get<Employee[]>('http://localhost:8080/api/users/employees').subscribe({
      next: (data) => {
        employees = data;
        if (activeCategory === 'employees') {
          displayedData = [...employees];
        }
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      }
    });
  }

  fetchCustomers(customers: Customer[], activeCategory: string, displayedData: (Employee | Customer)[]) {
    this.http.get<Customer[]>('http://localhost:8080/api/users/customers').subscribe({
      next: (data) => {
        customers = data;
        if (activeCategory === 'customers') {
          displayedData = [...customers];
        }
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
      }
    });
  }

  deletePerson(person: Employee | Customer, displayedData: (Employee | Customer)[]) {
    if (!person || !person.id) {
      console.error('Invalid person object:', person);
      return;
    }

    const id = person.id;

    const isEmployee = 'pozicija' in person;
    const apiUrl = isEmployee
      ? `http://localhost:8080/api/users/employee/${id}`
      : `http://localhost:8080/api/users/customer/${id}`;

    this.http.delete(apiUrl).subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log(response.data.message);
          displayedData = displayedData.filter(p => p.id !== id);
        } else {
          console.error('Error deleting person:', response);
        }
      },
      error: (err) => {
        console.error('API error:', err);
      }
    });
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
  povezaniRacuni: number[];
  pozicija: null;
  aktivan: null;
}


export interface Employee {
  id: number;
  ime: string;
  prezime: string;
  datumRodjenja: Date;
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
}

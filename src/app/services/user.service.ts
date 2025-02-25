import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users'; // Base API URL

  constructor(private http: HttpClient) {}

  updateEmployee(id: number, employeeData: Partial<Employee>): Observable<{ success: boolean; data: { message: string } }> {

    const filteredData = Object.fromEntries(
      Object.entries(employeeData).filter(([_, value]) => value !== undefined && value !== null)
    );

    return this.http.put<{ success: boolean; data: { message: string } }>(`${this.apiUrl}/employee/${id}`, filteredData);
  }

  updateClient(id: number, clientData: Partial<Client>): Observable<{ success: boolean; data: { message: string } }> {

    const filteredData = Object.fromEntries(
      Object.entries(clientData).filter(([_, value]) => value !== undefined && value !== null)
    );

    return this.http.put<{ success: boolean; data: { message: string } }>(`${this.apiUrl}/customer/${id}`, filteredData);
  }

  updateEmployeePermissions(id: number, permissions: string[]): Observable<{ success: boolean; data: { message: string } }> {
    const body = { permissions };

    return this.http.put<{ success: boolean; data: { message: string } }>(`${this.apiUrl}/employee/${id}/permissions`, body);
  }

  updateCustomerPermissions(id: number, permissions: string[]): Observable<{ success: boolean; data: { message: string } }> {
    const body = { permissions };

    return this.http.put<{ success: boolean; data: { message: string } }>(`${this.apiUrl}/customer/${id}/permissions`, body);
  }


}


export interface Client  {
  id: number,
  Ime: string,
  Prezime: string,
  Datum_rodjenja: string,
  Pol: string,
  Email_adresa: string,
  Broj_telefona: string,
  Adresa: string,
  Password: string,
  Povezani_racuni: Array<string>

};


export interface Employee {
  id?: number,
  Ime?: string;
  Prezime?: string;
  Datum_rodjenja?: string;
  Pol?: string;
  Email_adresa?: string;
  Broj_telefona?: string;
  Adresa?: string;
  Username?: string;
  Password?: string;
  Pozicija?: string;
  Departman?: string;
  Aktivan?: boolean;
}

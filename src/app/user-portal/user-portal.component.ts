import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Employee {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  pozicija: string;
  broj_telefona: string;
  aktivan: boolean;
}

@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.css']
})
export class UserPortalComponent implements OnInit {
  employees: Employee[] = [];
  searchQuery: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.http.get<Employee[]>('/api/users/employees').subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      }
    });
  }

  editEmployee(employee: Employee) {
    // This function will remain empty for now
  }

  addEmployee(){

  }

  sledece(){

  }

  filterEmployees($event: Event){

  }

  deleteEmployee(employee: Employee){

  }

  logout(){

  }
}

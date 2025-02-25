import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Employee {
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

@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.css']
})
export class UserPortalComponent implements OnInit {
  employees: Employee[] = [];
  searchQuery: any;
  filteredEmployees: Employee[] = [];


  constructor(private http: HttpClient) {
    this.initializeEmployees();
  }

  initializeEmployees() {
    this.employees = [
      {
        id: 1,
        ime: "Marko",
        prezime: "Marković",
        datumRodjenja: new Date(1990, 5, 20),
        pol: "Muški",
        email: "marko@example.com",
        brojTelefona: "+381611234567",
        adresa: "Ulica 123, Beograd",
        username: "marko90",
        password: "hashed_password",
        saltPassword: "random_salt",
        pozicija: "Menadžer",
        departman: "IT",
        aktivan: true
      },
      {
        id: 2,
        ime: "Ana",
        prezime: "Anić",
        datumRodjenja: new Date(1995, 10, 15),
        pol: "Ženski",
        email: "ana@example.com",
        brojTelefona: "+381629876543",
        adresa: "Ulica 456, Novi Sad",
        username: "ana95",
        password: "hashed_password",
        saltPassword: "random_salt",
        pozicija: "Programer",
        departman: "Razvoj",
        aktivan: true
      },
      {
        id: 3,
        ime: "Jovan",
        prezime: "Jovanović",
        datumRodjenja: new Date(1988, 2, 5),
        pol: "Muški",
        email: "jovan@example.com",
        brojTelefona: "+381631122334",
        adresa: "Ulica 789, Niš",
        username: "jovan88",
        password: "hashed_password",
        saltPassword: "random_salt",
        pozicija: "Administrator",
        departman: "Sistem",
        aktivan: false
      }
    ];
    this.filteredEmployees = [...this.employees];
  }

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

  }

  addEmployee(){

  }

  sledece(){

  }

  filterEmployees(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredEmployees = this.employees.filter(employee =>
      employee.ime.toLowerCase().includes(searchTerm) ||
      employee.prezime.toLowerCase().includes(searchTerm) ||
      employee.pozicija.toLowerCase().includes(searchTerm) ||
      employee.email.toLowerCase().includes(searchTerm)
    );
  }

  deleteEmployee(employee: Employee){

  }

  logout(){

  }
}

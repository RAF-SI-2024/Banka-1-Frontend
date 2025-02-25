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

interface Customer {
  id: number;
  ime: string;
  prezime: string;
  datumRodjenja: number; // Stored as a timestamp (Long)
  pol: string;
  email: string;
  brojTelefona: string;
  adresa: string;
  password: string;
  saltPassword: string;
  povezaniRacuni: number[]; // Array of connected account IDs
  pozicija: null;
  aktivan: null;
}

@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.css']
})
export class UserPortalComponent implements OnInit {
  employees: Employee[] = [];
  customers: Customer[] = [];
  displayedData: (Employee | Customer)[] = [];
  searchQuery: string = '';
  activeCategory: 'employees' | 'customers' = 'employees';

  constructor(private http: HttpClient) {
    this.initializeEmployees();
    this.initializeCustomers();
    this.displayedData = this.employees; // Default to customers
  }

  ngOnInit() {
    this.fetchEmployees();
    this.fetchCustomers();
  }

  fetchEmployees() {
    this.http.get<Employee[]>('http://localhost:8080/api/users/employees').subscribe({
      next: (data) => {
        this.employees = data;
        if (this.activeCategory === 'employees') {
          this.displayedData = [...this.employees];
        }
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      }
    });
  }

  fetchCustomers() {
    this.http.get<Customer[]>('http://localhost:8080/api/users/customers').subscribe({
      next: (data) => {
        this.customers = data;
        if (this.activeCategory === 'customers') {
          this.displayedData = [...this.customers];
        }
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
      }
    });
  }

  initializeEmployees() {
    this.employees = [
      {
        id: 1,
        ime: "Marko",
        prezime: "Marković",
        datumRodjenja: new Date(1990, 5, 15),
        pol: "Muški",
        email: "marko@example.com",
        brojTelefona: "0601234567",
        adresa: "Ulica 1, Beograd",
        username: "markom",
        password: "hashed_password",
        saltPassword: "random_salt",
        pozicija: "Software Developer",
        departman: "IT",
        aktivan: true
      },
      {
        id: 2,
        ime: "Ana",
        prezime: "Anić",
        datumRodjenja: new Date(1988, 10, 25),
        pol: "Ženski",
        email: "ana@example.com",
        brojTelefona: "0659876543",
        adresa: "Ulica 2, Novi Sad",
        username: "anaa",
        password: "hashed_password",
        saltPassword: "random_salt",
        pozicija: "Project Manager",
        departman: "Business",
        aktivan: true
      }
    ];
  }

  initializeCustomers() {
    this.customers = [
      {
        id: 101,
        ime: "Petar",
        prezime: "Petrović",
        datumRodjenja: 482198400000, // Timestamp (Unix Epoch)
        pol: "Muški",
        email: "petar@example.com",
        brojTelefona: "0603335555",
        adresa: "Klijentska ulica 10, Beograd",
        password: "hashed_password",
        saltPassword: "random_salt",
        povezaniRacuni: [2001, 2002],
        pozicija: null,
        aktivan: null
      },
      {
        id: 102,
        ime: "Jelena",
        prezime: "Jelić",
        datumRodjenja: 715305600000, // Timestamp
        pol: "Ženski",
        email: "jelena@example.com",
        brojTelefona: "0655554444",
        adresa: "Biznis centar, Novi Sad",
        password: "hashed_password",
        saltPassword: "random_salt",
        povezaniRacuni: [3005],
        pozicija: null,
        aktivan: null
      }
    ];
  }

  changeCategory(category: 'employees' | 'customers') {
    this.activeCategory = category;
    this.displayedData = category === 'employees' ? [...this.employees] : [...this.customers];
  }

  filterData(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.activeCategory === 'employees') {
      this.displayedData = this.employees.filter(employee =>
        employee.ime.toLowerCase().includes(searchTerm) ||
        employee.prezime.toLowerCase().includes(searchTerm) ||
        employee.pozicija.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm)
      );
    } else {
      this.displayedData = this.customers.filter(customers =>
        customers.ime.toLowerCase().includes(searchTerm) ||
        customers.prezime.toLowerCase().includes(searchTerm) ||
        customers.email.toLowerCase().includes(searchTerm)
      );
    }
  }

  editPerson(person: Employee | Customer) {
    console.log('Editing employee:', person);
  }

  addPerson() {
    console.log('Adding person');
  }

  deletePerson(person: Employee | Customer) {
    //TODO
    console.log('Deleting person:', person);
  }

  logout() {
    console.log('Logging out...');
  }

  nextPage(){
    //TODO
  }
}

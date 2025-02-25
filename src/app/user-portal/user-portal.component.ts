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
  datumRodjenja: Date; // Stored as a timestamp (Long)
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
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;  // To track total number of items
  totalPages: number = 0;  // To calculate total pages

  constructor(private http: HttpClient) {
    this.initializeEmployees();
    this.initializeCustomers();
    this.activeCategory = 'employees';  // Default category to employees
    this.displayedData = this.employees; // Default to employees
    this.calculatePagination();    }

  ngOnInit() {
    this.fetchData();
    // this.fetchEmployees();
    // this.fetchCustomers();
  }

  fetchData() {
    const apiUrl = this.activeCategory === 'employees'
      ? 'http://localhost:8080/api/users/employees'
      : 'http://localhost:8080/api/users/customers';

    this.http.get<any>(`${apiUrl}?page=${this.currentPage}&limit=${this.itemsPerPage}`).subscribe({
      next: (data) => {
        this.totalItems = data.totalItems;  // Assuming response contains totalItems
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);  // Calculate total pages
        this.displayedData = data.items;  // Assuming response contains items for current page
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
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
      },
      {
        id: 3,
        ime: "Jovan",
        prezime: "Jovanović",
        datumRodjenja: new Date(1995, 2, 5),
        pol: "Muški",
        email: "jovan@example.com",
        brojTelefona: "0609876543",
        adresa: "Ulica 3, Beograd",
        username: "jovanj",
        password: "hashed_password",
        saltPassword: "random_salt",
        pozicija: "UI Designer",
        departman: "Design",
        aktivan: true
      },

    ];
  }

  initializeCustomers() {
    this.customers = [
      {
        id: 101,
        ime: "Petar",
        prezime: "Petrović",
        datumRodjenja: new Date(1990, 5, 15), // Timestamp (Unix Epoch)
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
        datumRodjenja: new Date(1988, 10, 25), // Timestamp
        pol: "Ženski",
        email: "jelena@example.com",
        brojTelefona: "0655554444",
        adresa: "Biznis centar, Novi Sad",
        password: "hashed_password",
        saltPassword: "random_salt",
        povezaniRacuni: [3005],
        pozicija: null,
        aktivan: null
      },
      {
        id: 103,
        ime: "Milan",
        prezime: "Milić",
        datumRodjenja: new Date(1995, 2, 5), // Timestamp
        pol: "Muški",
        email: "milan@example.com",
        brojTelefona: "0621234567",
        adresa: "Novi Beograd, Beograd",
        password: "hashed_password",
        saltPassword: "random_salt",
        povezaniRacuni: [4002],
        pozicija: null,
        aktivan: null
      }
    ];
  }

  changeCategory(category: 'employees' | 'customers') {
    this.activeCategory = category;
    this.calculatePagination();
  }

  calculatePagination() {
    const data = this.activeCategory === 'employees' ? this.employees : this.customers;
    this.totalItems = data.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedData();
  }

  updateDisplayedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedData = this.activeCategory === 'employees'
      ? this.employees.slice(start, end)
      : this.customers.slice(start, end);
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
    if (!person || !person.id) {
      console.error('Invalid person object:', person);
      return;
    }

    const id = person.id;

    const isEmployee = 'pozicija' in person; // Check if the person is an employee based on 'pozicija' property
    const apiUrl = isEmployee
      ? `http://localhost:8080/api/users/employee/${id}`
      : `http://localhost:8080/api/users/customer/${id}`;

    this.http.delete(apiUrl).subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log(response.data.message);
          this.displayedData = this.displayedData.filter(p => p.id !== id); // Remove from UI
        } else {
          console.error('Error deleting person:', response);
        }
      },
      error: (err) => {
        console.error('API error:', err);
      }
    });
  }


  logout() {
    console.log('Logging out...');
  }

  // Method for going to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  // Method for going to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

}

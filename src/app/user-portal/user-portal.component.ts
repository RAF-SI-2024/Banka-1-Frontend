import { Component, OnInit } from '@angular/core';
import {Customer, Employee, UserService} from "../services/user.service";

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
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private userService: UserService) {
    // this.initializeEmployees();
    // this.initializeCustomers();
    this.activeCategory = 'employees';
    this.displayedData = this.employees;
    this.calculatePagination();

  }

  ngOnInit() {
    this.userService.fetchData(this.activeCategory, this.currentPage, this.itemsPerPage, this.totalItems, this.totalPages, this.displayedData);
    // this.userService.fetchEmployees();
    // this.userService.fetchCustomers();
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
        datumRodjenja: 482198400000,
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
        datumRodjenja: 715305600000,
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
        datumRodjenja: 614070400000,
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
    this.userService.deletePerson(person, this.displayedData);
  }


  logout() {
    console.log('Logging out...');
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

}

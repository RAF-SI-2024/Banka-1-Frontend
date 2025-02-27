import { Component, OnInit } from '@angular/core';
import {Customer, Employee, UserService} from "../services/user.service";
import {ModalService} from "../services/modal.service";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

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
  activeCategory: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private userService: UserService, private authService: AuthService, private modalService: ModalService, private ruter:Router) {
    // this.initializeEmployees();
    // this.initializeCustomers();
    this.activeCategory = '';
    this.displayedData = this.employees;
    // this.calculatePagination();

  }

  ngOnInit() {
    this.loadEmployees();
    this.loadCustomers();
    this.calculatePagination();
  }

  loadEmployees() {
    this.userService.fetchEmployees().subscribe({
      next: (data) => {
        this.employees = data.employees;
        this.totalItems = data.total;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.displayedData = this.employees;
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      },
    });
  }

  loadCustomers() {
    this.userService.fetchCustomers().subscribe({
      next: (data) => {
        this.customers = data.customers;
        this.totalItems = data.total;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.displayedData = this.customers;
      },
      error: (error) => {
        console.error('Error fetching customers:', error);
      },
    });
  }


  changeCategory(category: string) {
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


  addPerson() {
    console.log('Adding person');
  }

  deletePerson(person: Employee | Customer) {
    if (this.isEmployee(person)) {

      this.userService.deleteEmployee(person.id).subscribe({
        next: (data) => {
          this.displayedData = this.displayedData.filter(p => p.id !== person.id);
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
        },
      });

    } else if (this.isCustomer(person)) {

      this.userService.deleteCustumer(person.id).subscribe({
        next: (data) => {
          this.displayedData = this.displayedData.filter(p => p.id !== person.id);
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
        },
      });

    } else {
      console.error('Unknown type:', person);
    }
  }


  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.ruter.navigate(['/login']);
      },
      error: (error) => console.error('Greška prilikom odjave:', error)
    });
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


// Metoda za menjanje aktivne kategorije
  setActiveCategory(category: string): void {
    this.activeCategory = category;
    this.currentPage = 1;  
  }
    
  openModal(person: Employee | Customer) {
    if (this.isEmployee(person)) {
      this.modalService.openModal('employee', person);
    } else if (this.isCustomer(person)) {
      this.modalService.openModal('customer', person);
    } else {
      console.error('Unknown type:', person);
    }
  }

  private isEmployee(person: Employee | Customer): person is Employee {
    return (person as Employee).username !== undefined;
  }

  private isCustomer(person: Employee | Customer): person is Customer {
    return (person as Customer).povezaniRacuni !== undefined;
  }

}

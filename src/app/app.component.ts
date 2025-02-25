import {
  Component,
  OnInit,
} from '@angular/core';
//import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'banka1Front';
  hasCreateEmployeePermission: boolean = true;  // treba da se promeni na false kada se doda auth
  hasCreateCustomerPermission: boolean = true; // treba da se promeni na false kada se doda auth

  constructor(
    //private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Proveravamo permisije korisnika prilikom inicijalizacije komponente
   // const permissions = this.authService.getUserPermissions();
   // this.hasCreateEmployeePermission = permissions.includes('user.employee.create');
    // this.hasCreateCustomerPermission = permissions.includes('user.customer.create');
  }

  isCustomerModalOpen: boolean = false;
  isEmployeeModalOpen: boolean = false;

  openCustomerModal(): void {
    this.isCustomerModalOpen = true;
  }
  closeCustomerModal(): void {
    this.isCustomerModalOpen = false;
  }
  openEmployeeModal(): void {
    this.isEmployeeModalOpen = true;
  }
  closeEmployeeModal(): void {
    this.isEmployeeModalOpen = false;
  }

}

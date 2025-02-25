import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.css']
})
export class UserPortalComponent implements OnInit{

  isModalOpen = true;
  isAccountModalOpen: boolean = false
  activeCategory: 'employees' | 'customers' = 'employees';
  client : any = {};
  employee: any = {};


  klijent = {
    id: 1223,
    Ime: 'Petar ',
    Prezime: 'Petrović',
    Datum_rodjenja: '15.03.2021',
    Pol: 'M',
    Email_adresa: 'petar@primer.raf',
    Broj_telefona: '+381645555555',
    Adresa: 'Njegoševa 25',
    Password: 'sifra1 *',
    Povezani_racuni: ['111222222222222211','111222222222222233','111222222222222244']

  };

  zaposleni = {
    id: 1223,
    Ime: 'Petar',
    Prezime: 'Petrović',
    Datum_rodjenja: '1990-05-20',
    Pol: 'M',
    Email_adresa: 'petar@primer.raf',
    Broj_telefona: '+381645555555',
    Adresa: 'Njegoševa 25',
    Username: 'petar90',
    Password: 'sifra1*',
    Pozicija: 'Menadžer',
    Departman: 'Finansije',
    Aktivan: true
  };

  selectedPermissions: string[] = [];
  availablePermissions: string[] = ['employee.create', 'customer.create', 'employee.edit', 'customer.edit', 'employee.delete', 'customer.delete','employee.list', 'customer.list', 'employee.set_permissions', 'customer.set_permissions', 'employee.view', 'customer.view'];
  newPermission: string = '';
  selectedAccount: string = '';
  newAccount: string = '';

  updatedPermission:string[] = [];
  updatedEmployee: any = {};
  updatedClient: any = {};
  updatedEmployeeFields: Partial<typeof this.employee> = {};
  updatedCostumerFields: Partial<typeof this.client> = {};


  constructor(private userService: UserService) {}



  ngOnInit(): void {

  }

  trackEmployeeChanges() {
    this.updatedEmployeeFields = {};

    Object.keys(this.employee).forEach((key) => {
      const originalValue = (this.employee as Record<string, any>)[key];
      const updatedValue = (this.updatedEmployee as Record<string, any>)[key];

      if (originalValue !== updatedValue) {
        (this.updatedEmployeeFields as Record<string, any>)[key] = updatedValue;
      }
    });
  }

  trackCustomerChanges() {
    this.updatedCostumerFields = {};

    Object.keys(this.client).forEach((key) => {
      const originalValue = (this.client as Record<string, any>)[key];
      const updatedValue = (this.updatedClient as Record<string, any>)[key];

      if (Array.isArray(originalValue) && Array.isArray(updatedValue)) {
        if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
          (this.updatedCostumerFields as Record<string, any>)[key] = [...updatedValue];
        }
      } else if (originalValue !== updatedValue) {
        (this.updatedCostumerFields as Record<string, any>)[key] = updatedValue;
      }
    });

    console.log('Updated Customer Fields:', this.updatedCostumerFields);
  }


  updateEmployee(){
    if(this.activeCategory === 'employees') {
      const updatedFields: Partial<typeof this.employee> = {};
      let permissions;

      const arraysAreEqual = (arr1: any[], arr2: any[]): boolean => {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((value, index) => value === arr2[index]);
      };

      if (Object.keys(this.updatedEmployeeFields).length === 0 && arraysAreEqual(this.selectedPermissions, this.updatedPermission) ) {
        console.log("No changes detected");
        this.closeModal()
      }

      permissions = this.selectedPermissions.map(permission => 'user.' + permission);


      // this.userService.updateEmployee(this.zaposleni.id, updatedFields).subscribe({
      //   next: () => {
      //     alert('Employee updated sucessfully');
      //   },
      //   error: (error) => {
      //     console.error('Error updating employee', error);
      // },
      // });

      // this.userService.updateEmployeePermissions(this.zaposleni.id, permissions).subscribe({
      //   next:()=>{
      //     alert('Employee permissions updated sucessfully');
      //   },
      //   error:(error) => {
      //     console.error('Error updating employee permissions', error);
      //   },
      // });


    }
    else{

      // this.userService.updateClient(this.klijent.id, updatedFields).subscribe({
      //   next: () => {
      //     alert('Client updated sucessfully');
      //   },
      //   error: (error) => {
      //     console.error('Error updating client', error);
      // },
      // });


    }
  }

  addAccount(){
    if(this.newAccount && !this.updatedClient.Povezani_racuni.includes(this.newAccount)){
      this.updatedClient.Povezani_racuni.push(this.newAccount);
      this.newAccount = ''
      this.closeAccountModal()
      this.trackCustomerChanges();
    }else{
      alert("Taj nalog vec postji.")
    }
  }

  removeAccount() {
    if (confirm("Da li ste sigurni da zelite da obrisete racun " + this.selectedAccount +"?")) {
      this.updatedClient.Povezani_racuni = this.updatedClient.Povezani_racuni.filter((account: string) => account !== this.selectedAccount);
      this.trackCustomerChanges();
    } else {
      console.log("Action canceled.");
    }
  }

  addPermission() {
    if (this.newPermission && !this.selectedPermissions.includes(this.newPermission)) {
      this.selectedPermissions.push(this.newPermission);
    }
    this.newPermission = '';
  }

  removePermission(permission: string) {
    this.selectedPermissions = this.selectedPermissions.filter(p => p !== permission);
  }


  editPerson(user:any) {
    this.isModalOpen = true;
    if(this.activeCategory === 'customers'){
      this.updatedClient = structuredClone(user);
      this.updatedCostumerFields = {};
      this.client = user;
    }else {
      this.employee = user;
      this.updatedEmployee = structuredClone(user);
      this.updatedEmployeeFields = {};
      this.updatedPermission = structuredClone(this.selectedPermissions);
    }


  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedPermissions = []
  }

  openAccountModal() {
    this.isAccountModalOpen = true;
  }

  closeAccountModal() {
    this.isAccountModalOpen = false;
  }

}

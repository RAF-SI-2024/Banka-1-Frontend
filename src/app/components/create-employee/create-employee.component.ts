import {Component, EventEmitter, Output} from '@angular/core';
import { UserService } from '../../services/user.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent {
  employee = {
    firstName: '',
    lastName: '',
    birthDate: null as Date | string | null,
    gender: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    position: '',
    department: '',
    active: true
  };
  @Output() employeeCreated: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private userService: UserService
  ) {}

  onSubmit(employeeForm: any): void {
    if (employeeForm.valid) {
      const formattedBirthDate = this.employee.birthDate
        ? formatDate(this.employee.birthDate, 'yyyy-MM-dd', 'en-US')
        : null;

      const requestBody = {
        ime: this.employee.firstName,
        prezime: this.employee.lastName,
        datum_rodjenja: formattedBirthDate,
        pol: this.employee.gender === 'F' ? 'Ž' : 'M',
        email: this.employee.email,
        broj_telefona: this.employee.phone,
        adresa: this.employee.address,
        username: this.employee.username,
        password: null,
        pozicija: this.employee.position,
        departman: this.employee.department,
        aktivan: this.employee.active
      };

      this.userService.createEmployee(requestBody).subscribe({
        next: (response) => {
          console.log('Zaposleni uspešno kreiran:', response);
          alert('Zaposleni uspešno kreiran!');
          this.employeeCreated.emit();

        },
        error: (error) => {
          console.error('Greška prilikom kreiranja zaposlenog:', error);
          alert('Došlo je do greške pri kreiranju zaposlenog.');
        }
      });
    } else {
      alert('Molimo vas da popunite sva obavezna polja!');
    }
  }

}

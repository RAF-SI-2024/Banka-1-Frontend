import {Component, EventEmitter, Output} from '@angular/core';
import { UserService } from '../../services/user.service';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent {
  customer = {
    firstName: '',
    lastName: '',
    birthDate: null as Date | string | null,
    gender: '',
    email: '',
    phone: '',
    address: ''
  };

  @Output() customerCreated: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private userService: UserService
  ) {}

  onSubmit(customerForm: any): void {
    if (customerForm.valid) {
      const formattedBirthDate = this.customer.birthDate
        ? formatDate(this.customer.birthDate, 'yyyy-MM-dd', 'en-US')
        : null;

      const requestBody = {
        ime: this.customer.firstName,
        prezime: this.customer.lastName,
        datum_rodjenja: formattedBirthDate,
        pol: this.customer.gender === 'F' ? 'Ž' : 'M',
        email: this.customer.email,
        broj_telefona: this.customer.phone,
        adresa: this.customer.address,
        password: null
      };

      this.userService.createCustomer(requestBody).subscribe({
        next: (response) => {
          console.log('Musterija uspešno kreirana:', response);
          alert('Musterija uspešno kreirana!');
          this.customerCreated.emit();
        },
        error: (error) => {
          console.error('Greška prilikom kreiranja musterije:', error);
          alert('Došlo je do greške pri kreiranju musterije.');
        }
      });
    } else {
      alert('Molimo vas da popunite sva obavezna polja!');
    }
  }

}

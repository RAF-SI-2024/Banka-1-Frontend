import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCustomerComponent } from './create-customer.component';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateCustomerComponent', () => {
  let component: CreateCustomerComponent;
  let fixture: ComponentFixture<CreateCustomerComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['createCustomer']);

    await TestBed.configureTestingModule({
      declarations: [CreateCustomerComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCustomerComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call createCustomer on submit with valid data', () => {
    component.customer = {
      firstName: 'Petra',
      lastName: 'Petrović',
      birthDate: new Date('1990-05-15'),
      gender: 'F',
      email: 'petra@example.com',
      phone: '+381641234567',
      address: 'Ulica 12, Beograd'
    };

    const mockResponse = { message: 'Musterija kreirana' };
    userService.createCustomer.and.returnValue(of(mockResponse));

    const fakeCustomerForm = { valid: true };

    spyOn(component.customerCreated, 'emit'); // Proveravamo da li se emitovao event

    component.onSubmit(fakeCustomerForm);

    expect(userService.createCustomer).toHaveBeenCalledWith(jasmine.objectContaining({
      ime: 'Petra',
      prezime: 'Petrović',
      datum_rodjenja: '1990-05-15',
      pol: 'Ž', // Konverzija iz 'F' u 'Ž'
      email: 'petra@example.com',
      broj_telefona: '+381641234567',
      adresa: 'Ulica 12, Beograd'
    }));
    expect(component.customerCreated.emit).toHaveBeenCalled();
  });

  it('should handle error when createCustomer fails', () => {
    component.customer = {
      firstName: 'Petra',
      lastName: 'Petrović',
      birthDate: new Date('1990-05-15'),
      gender: 'F',
      email: 'petra@example.com',
      phone: '+381641234567',
      address: 'Ulica 12, Beograd'
    };

    userService.createCustomer.and.returnValue(throwError(() => new Error('Greška')));

    spyOn(window, 'alert');
    component.onSubmit({ valid: true });

    expect(userService.createCustomer).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Došlo je do greške pri kreiranju musterije.');
  });

  it('should show alert if required fields are missing', () => {
    spyOn(window, 'alert');
    component.customer.firstName = ''; // Nedostaje obavezno polje
    component.onSubmit({ valid: false });

    expect(window.alert).toHaveBeenCalledWith('Molimo vas da popunite sva obavezna polja!');
    expect(userService.createCustomer).not.toHaveBeenCalled();
  });
});

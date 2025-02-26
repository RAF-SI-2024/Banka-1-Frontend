import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.api}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request to create employee', () => {
    const employeeData = {
      ime: 'Marko',
      prezime: 'Petrović',
      datum_rodjenja: '1990-05-15',
      pol: 'M',
      email: 'marko@example.com',
      broj_telefona: '+381641234567',
      adresa: 'Ulica 12, Beograd',
      username: 'markop',
      password: 'PrivremenaLozinka123',
      pozicija: 'Menadžer',
      departman: 'IT',
      aktivan: true,
    };

    service.createEmployee(employeeData).subscribe((response) => {
      expect(response).toEqual({ message: 'Zaposleni kreiran' });
    });

    const req = httpMock.expectOne(`${apiUrl}/employees`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(employeeData);
    req.flush({ message: 'Zaposleni kreiran' });
  });

  it('should handle error when creating employee fails', () => {
    const employeeData = { ime: 'Marko', prezime: 'Petrović' };

    service.createEmployee(employeeData).subscribe(
      () => fail('Očekivana greška'),
      (error) => expect(error.status).toBe(500)
    );

    const req = httpMock.expectOne(`${apiUrl}/employees`);
    req.flush('Greška na serveru', { status: 500, statusText: 'Server Error' });
  });

  it('should send POST request to create customer', () => {
    const customerData = {
      ime: 'Jovana',
      prezime: 'Marković',
      datum_rodjenja: '1985-07-10',
      pol: 'Ž',
      email: 'jovana@example.com',
      broj_telefona: '+381651234567',
      adresa: 'Trg Republike 5, Beograd',
      password: 'PrivremenaLozinka123',
    };

    service.createCustomer(customerData).subscribe((response) => {
      expect(response).toEqual({ message: 'Musterija kreirana' });
    });

    const req = httpMock.expectOne(`${apiUrl}/customers`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(customerData);
    req.flush({ message: 'Musterija kreirana' });
  });

  it('should handle error when creating customer fails', () => {
    const customerData = { ime: 'Jovana', prezime: 'Marković' };

    service.createCustomer(customerData).subscribe(
      () => fail('Očekivana greška'),
      (error) => expect(error.status).toBe(500)
    );

    const req = httpMock.expectOne(`${apiUrl}/customers`);
    req.flush('Greška na serveru', { status: 500, statusText: 'Server Error' });
  });
});

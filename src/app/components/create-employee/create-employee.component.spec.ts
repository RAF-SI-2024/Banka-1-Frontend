import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEmployeeComponent } from './create-employee.component';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateEmployeeComponent', () => {
  let component: CreateEmployeeComponent;
  let fixture: ComponentFixture<CreateEmployeeComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['createEmployee']);

    await TestBed.configureTestingModule({
      declarations: [CreateEmployeeComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEmployeeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call createEmployee on submit with valid data', () => {
    component.employee = {
      firstName: 'Marko',
      lastName: 'Petrović',
      birthDate: new Date('1990-05-15'),
      gender: 'M',
      email: 'marko@example.com',
      phone: '+381641234567',
      address: 'Ulica 12, Beograd',
      username: 'markop',
      position: 'Menadžer',
      department: 'IT',
      active: true,
    };

    const mockResponse = { message: 'Zaposleni kreiran' };
    userService.createEmployee.and.returnValue(of(mockResponse));

    const fakeEmployeeForm = { valid: true };
    spyOn(component.employeeCreated, 'emit');
    spyOn(window, 'alert');

    component.onSubmit(fakeEmployeeForm);

    expect(userService.createEmployee).toHaveBeenCalled();
    expect(component.employeeCreated.emit).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Zaposleni uspešno kreiran!');
  });

  it('should handle error when createEmployee fails', () => {
    component.employee.firstName = 'Marko';
    component.employee.lastName = 'Petrović';
    component.employee.birthDate = new Date('1990-05-15');
    component.employee.gender = 'M';

    userService.createEmployee.and.returnValue(throwError(() => new Error('Greška')));

    spyOn(window, 'alert');
    component.onSubmit({ valid: true });

    expect(userService.createEmployee).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Došlo je do greške pri kreiranju zaposlenog.');
  });

  it('should show alert if required fields are missing', () => {
    spyOn(window, 'alert');
    component.employee.firstName = '';
    component.onSubmit({ valid: false });

    expect(window.alert).toHaveBeenCalledWith('Molimo vas da popunite sva obavezna polja!');
    expect(userService.createEmployee).not.toHaveBeenCalled();
  });
});

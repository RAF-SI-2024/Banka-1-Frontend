import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
// import { AuthService } from './services/auth.service';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        // {
        //   provide: AuthService,
        //   useValue: {
        //     getUserPermissions: () => ['user.employee.create'],
        //   },
        // },
      ],
    });

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have title 'banka1Front'`, () => {
    expect(component.title).toEqual('banka1Front');
  });

  it('should set default permission values to true (temporary)', () => {
    expect(component.hasCreateEmployeePermission).toBeTrue();
    expect(component.hasCreateCustomerPermission).toBeTrue();
  });

  it('should open and close customer modal', () => {
    component.openCustomerModal();
    expect(component.isCustomerModalOpen).toBeTrue();

    component.closeCustomerModal();
    expect(component.isCustomerModalOpen).toBeFalse();
  });

  it('should open and close employee modal', () => {
    component.openEmployeeModal();
    expect(component.isEmployeeModalOpen).toBeTrue();

    component.closeEmployeeModal();
    expect(component.isEmployeeModalOpen).toBeFalse();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
// import { AuthService } from './services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
//   let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule],
//       declarations: [AppComponent],
//       providers: [
//         // {
//         //   provide: AuthService,
//         //   useValue: {
//         //     getUserPermissions: () => ['user.employee.create'],
//         //   },
//         // },
//       ],
//     });

//     const fixture = TestBed.createComponent(AppComponent);
//     component = fixture.componentInstance;
//   });

//   it('should create the app', () => {
//     expect(component).toBeTruthy();
//   });

//   it(`should have title 'banka1Front'`, () => {
//     expect(component.title).toEqual('banka1Front');
//   });

//   it('should set default permission values to true (temporary)', () => {
//     expect(component.hasCreateEmployeePermission).toBeTrue();
//     expect(component.hasCreateCustomerPermission).toBeTrue();
//   });

//   it('should open and close customer modal', () => {
//     component.openCustomerModal();
//     expect(component.isCustomerModalOpen).toBeTrue();

//     component.closeCustomerModal();
//     expect(component.isCustomerModalOpen).toBeFalse();
//   });

//   it('should open and close employee modal', () => {
//     component.openEmployeeModal();
//     expect(component.isEmployeeModalOpen).toBeTrue();

//     component.closeEmployeeModal();
//     expect(component.isEmployeeModalOpen).toBeFalse();
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent)
      .toContain('banka1Front');
  });
});

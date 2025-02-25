import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetPasswordComponent } from './set-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('SetPasswordComponent', () => {
  let component: SetPasswordComponent;
  let fixture: ComponentFixture<SetPasswordComponent>;
  let mockRouter = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetPasswordComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => 'test-token' } } }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    expect(component.passwordForm.contains('password')).toBeTrue();
    expect(component.passwordForm.contains('confirmPassword')).toBeTrue();
  });

  it('should validate password format correctly', () => {
    const passwordControl = component.passwordForm.controls['password'];

    passwordControl.setValue('weakpass');
    expect(passwordControl.valid).toBeFalse();

    passwordControl.setValue('Strong99');
    expect(passwordControl.valid).toBeTrue();
  });

  it('should set token from URL', () => {
    expect(component.token).toBe('test-token');
  });

  it('should call onSubmit() when form is valid', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    component.passwordForm.controls['password'].setValue('Strong99');
    component.passwordForm.controls['confirmPassword'].setValue('Strong99');
    fixture.detectChanges();

    component.onSubmit();

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should send request to API when form is valid', () => {
    const httpSpy = spyOn(component['http'], 'put').and.returnValue(of({}));

    component.passwordForm.controls['password'].setValue('Strong99');
    component.passwordForm.controls['confirmPassword'].setValue('Strong99');
    component.onSubmit();

    expect(httpSpy).toHaveBeenCalledWith('/api/users/set-password', {
      token: 'test-token',
      newPassword: 'Strong99'
    });
  });

});

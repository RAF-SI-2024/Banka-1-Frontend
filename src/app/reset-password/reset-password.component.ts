import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      const email = this.resetForm.value.email;
      this.authService.resetPassword(email).subscribe({
        next: () => {
          this.message = 'Link za resetovanje lozinke je poslat na vaš email.';
        },
        error: () => {
          this.message = 'Greška prilikom slanja linka za reset.';
        }
      });
    }
  }
}

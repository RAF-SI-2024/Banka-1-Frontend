import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  submitted = false;
  resetToken: string | null = null;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private route: ActivatedRoute,
      private router: Router
  ) {
    // Formiranje forme sa validatorima
    this.passwordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32),
        Validators.pattern(/^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    // Uzimanje tokena iz URL-a za resetovanje lozinke
    this.resetToken = this.route.snapshot.queryParamMap.get('token');
  }

  // Proverava da li su lozinke iste
  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Podnošenje forme
  onSubmit(): void {
    this.submitted = true;

    if (this.passwordForm.valid && this.resetToken) {
      const newPassword = this.passwordForm.get('password')?.value;

      this.authService.changePassword(newPassword, this.resetToken).subscribe({
        next: () => {
          alert('Lozinka uspešno promenjena!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Greška prilikom promene lozinke:', err);
          alert('Došlo je do greške. Pokušajte ponovo.');
        }
      });
    }
  }
}

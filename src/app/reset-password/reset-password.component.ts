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
    // Preuzimanje tokena iz URL-a
    this.resetToken = this.route.snapshot.queryParamMap.get('token');
    console.log('Reset token iz URL-a:', this.resetToken); // Dodato za prikaz tokena
    if (!this.resetToken) {
      alert('Token za reset lozinke nije pronađen.');
      this.router.navigate(['/login']);
    }
  }

  // Provera da li su lozinke identične
  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Podnošenje forme za promenu lozinke
  onSubmit(): void {
    this.submitted = true;

    if (this.passwordForm.valid && this.resetToken) {
      const newPassword = this.passwordForm.get('password')?.value;

      // Kreiranje JSON objekta za backend
      const requestData = {
        token: this.resetToken,
        newPassword: newPassword
      };

      this.authService.changePassword(requestData).subscribe({
        next: () => {
          alert('Lozinka je uspešno promenjena!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Greška prilikom promene lozinke:', err);
          alert('Došlo je do greške. Pokušajte ponovo.');
        }
      });
    } else {
      console.error('Forma nije validna ili nema tokena.');
    }
  }

  // Pomoćna metoda za lakši pristup poljima forme
  get f() {
    return this.passwordForm.controls;
  }
}

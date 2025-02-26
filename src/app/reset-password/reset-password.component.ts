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
    this.resetToken = this.route.snapshot.queryParamMap.get('token');
    console.log('Reset token iz URL-a:', this.resetToken);

    if (!this.resetToken) {
      alert('Token za reset lozinke nije pronađen.');
      this.router.navigate(['/login']);
    }
  }

  //da li se lozinke poklapaju
  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Slanje forme za promenu lozinke
  onSubmit(): void {
    this.submitted = true;

    if (this.passwordForm.invalid || !this.resetToken) {
      alert('Molimo vas da ispravno popunite sva polja.');
      return;
    }

    const newPassword = this.passwordForm.get('password')?.value;
    const payload = {
      token: this.resetToken,
      newPassword: newPassword
    };

    console.log('Slanje JSON objekta backendu:', payload);

    this.authService.changePassword(payload).subscribe({
      next: () => {
        alert('Lozinka uspešno promenjena! Sada možete da se prijavite sa novom lozinkom.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Greška prilikom promene lozinke:', err);
        alert('Došlo je do greške. Pokušajte ponovo.');
      }
    });
  }

}

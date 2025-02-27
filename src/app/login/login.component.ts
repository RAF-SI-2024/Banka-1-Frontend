import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading = false;
  submitted = false;  //promenljiva za praćenje slanja forme

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;  // Aktivira validaciju u HTML-u

    if (this.loginForm.invalid) {
      this.errorMessage = 'Molimo vas da ispravno popunite sva polja.';
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/user-portal']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'Pogrešan email ili lozinka.';
        } else {
          this.errorMessage = 'Došlo je do greške. Pokušajte kasnije.';
        }
      }
    });
  }

  onResetPassword(): void {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      alert('Unesite email za reset lozinke.');
      return;
    }

    this.authService.resetPassword(email).subscribe({
      next: () => alert('Link za reset lozinke poslat na email.'),
      error: () => alert('Greška prilikom slanja linka za reset.')
    });
  }

}

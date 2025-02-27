import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAppInitialized = false;
  private loginStatusSub: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  // // Briše localStorage pri zatvaranju prozora
  // @HostListener('window:beforeunload', ['$event'])
  // clearLocalStorageOnClose(event: Event): void {
  //   localStorage.clear();
  // }


  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAppInitialized = true;

    this.loginStatusSub = this.authService.loginStatusChanged.subscribe(
      (status: boolean) => {
        this.isLoggedIn = status;
      }
    );
  }


  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: (error) => console.error('Greška prilikom odjave:', error)
    });
  }

  ngOnDestroy(): void {
    this.loginStatusSub?.unsubscribe();
  }

  title = 'banka1Front';
  hasCreateEmployeePermission: boolean = true;  // treba da se promeni na false kada se doda auth
  hasCreateCustomerPermission: boolean = true; // treba da se promeni na false kada se doda auth

  isCustomerModalOpen: boolean = false;
  isEmployeeModalOpen: boolean = false;

  openCustomerModal(): void {
    this.isCustomerModalOpen = true;
  }
  closeCustomerModal(): void {
    this.isCustomerModalOpen = false;
  }
  openEmployeeModal(): void {
    this.isEmployeeModalOpen = true;
  }
  closeEmployeeModal(): void {
    this.isEmployeeModalOpen = false;
  }

}

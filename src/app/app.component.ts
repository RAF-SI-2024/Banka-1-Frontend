import {Component, OnInit} from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isLoggedIn = false;
  isAppInitialized = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    //provera trenutnog stanja logovanja
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAppInitialized = true; //true nakon inicijalizacije

    //pracenje promena u stanju logovanja
    this.authService.loginStatusChanged.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  title = 'banka1Front';
}

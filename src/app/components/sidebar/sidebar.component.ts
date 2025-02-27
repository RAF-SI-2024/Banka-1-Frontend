import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() categoryChanged = new EventEmitter<string>();
  constructor(private authService : AuthService, private router: Router) {
  }
  openEmployeeList(){
    this.categoryChanged.emit('employees');

  }
  openCustomerList(){
    this.categoryChanged.emit('customers');

  }
  userLogout(){
    this.authService.logout();
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import {DeskComponent} from "./desk/desk.component";
import { UserPortalComponent } from './user-portal/user-portal.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import {EditCustomerComponent} from "./components/edit-customer/edit-customer.component";
import {EditEmployeeComponent} from "./components/edit-employee/edit-employee.component";


const routes: Routes = [
  { path: '', component: DeskComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuard] },
  { path: 'set-password', component: SetPasswordComponent, canActivate: [AuthGuard] },
  { path: 'user-portal', component: UserPortalComponent, canActivate: [AuthGuard] },
  {path: 'user-portal',component:EditCustomerComponent, canActivate: [AuthGuard]},
  {path: 'user-portal',component:EditEmployeeComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

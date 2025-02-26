import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import {DeskComponent} from "./desk/desk.component";
import { UserPortalComponent } from './user-portal/user-portal.component';
import { SetPasswordComponent } from './set-password/set-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'desk', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'desk', component: DeskComponent},
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'set-password', component: SetPasswordComponent },
  { path: 'user-portal', component: UserPortalComponent },
  { path: '**', redirectTo: 'desk' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

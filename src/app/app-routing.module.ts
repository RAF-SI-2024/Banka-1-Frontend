import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeskComponent } from './desk/desk.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component'; //  UKLONI

const routes: Routes = [
  { path: '', redirectTo: 'desk', pathMatch: 'full' },
  { path: 'desk', component: DeskComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent }, //UKLONI
  { path: '**', redirectTo: 'desk' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

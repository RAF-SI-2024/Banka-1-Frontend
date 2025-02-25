import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetPasswordComponent } from './set-password/set-password.component';

const routes: Routes = [
  { path: 'set-password', component: SetPasswordComponent },
  { path: '', redirectTo: '/set-password', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

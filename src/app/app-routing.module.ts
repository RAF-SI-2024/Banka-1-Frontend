import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPortalComponent } from './user-portal/user-portal.component';

const routes: Routes = [
  { path: 'user-portal', component: UserPortalComponent },
  { path: '', redirectTo: '/user-portal', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

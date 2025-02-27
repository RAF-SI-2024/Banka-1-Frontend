import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DeskComponent } from './desk/desk.component';
import { UserPortalComponent } from './user-portal/user-portal.component';
import {EditEmployeeComponent} from "./components/edit-employee/edit-employee.component";
import {EditCustomerComponent} from "./components/edit-customer/edit-customer.component";
import { TableEmployesComponent } from './components/table-employes/table-employes.component';
import {CreateEmployeeComponent} from "./components/create-employee/create-employee.component";
import {CreateCustomerComponent} from "./components/create-customer/create-customer.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetPasswordComponent,
    SetPasswordComponent,
    DeskComponent,
    EditEmployeeComponent,
    EditCustomerComponent,
    UserPortalComponent,
    UserPortalComponent,
    TableEmployesComponent,
    CreateEmployeeComponent,
    CreateCustomerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}

import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {SetPasswordComponent} from "./set-password/set-password.component";
import {DeskComponent} from "./desk/desk.component";
import {UserPortalComponent} from "./user-portal/user-portal.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {CustomersComponent} from "./components/customers/customers.component";
import {EmployeesComponent} from "./components/employees/employees.component";
import {EditEmployeeComponent} from "./components/edit-employee/edit-employee.component";
import {EditCustomerComponent} from "./components/edit-customer/edit-customer.component";
import {TableEmployesComponent} from "./components/table-employes/table-employes.component";
import {CreateEmployeeComponent} from "./components/create-employee/create-employee.component";
import {CreateCustomerComponent} from "./components/create-customer/create-customer.component";
import {TableCustomersComponent} from "./components/table-customers/table-customers.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {AuthGuard} from "./guards/auth.guard";
import {NgModule} from "@angular/core";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetPasswordComponent,
    SetPasswordComponent,
    DeskComponent,
    UserPortalComponent,
    SidebarComponent,
    CustomersComponent,
    EmployeesComponent,
    EditEmployeeComponent,
    EditCustomerComponent,
    TableEmployesComponent,
    CreateEmployeeComponent,
    CreateCustomerComponent,
    TableCustomersComponent
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

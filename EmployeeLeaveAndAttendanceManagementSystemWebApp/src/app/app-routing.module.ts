import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';
import { ManageEmployeeAddComponent } from './manage-employee-add/manage-employee-add.component';
import { ManageEmployeeUpdateComponent } from './manage-employee-update/manage-employee-update.component';
import { ManageEmployeeViewIdComponent } from './manage-employee-view-id/manage-employee-view-id.component';


const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  // {path: "register", component: RegisterComponent},
  { path: "user", component: UserComponent },
  { path: "update-profile", component: UpdateUserComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  {
    path: "manage-employee", component: ManageEmployeeComponent, 
    children: [
      { path: '', redirectTo: 'manage-employee', pathMatch: 'full' },
      { path: 'add-employee', component: ManageEmployeeAddComponent },
      { path: 'view-employee', component: ManageEmployeeViewIdComponent},
      { path: "update-employee", component: ManageEmployeeUpdateComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

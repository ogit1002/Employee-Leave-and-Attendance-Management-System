import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExampleComponent } from './components/example/example.component';
import { LoginComponent } from './Auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { EmployeeManagementComponent } from './admin-manager/employee-management/employee-management.component';
import { AddLeaveRequestComponent } from './employee/add-leave-request/add-leave-request.component';
import { AttendanceManagementComponent } from './admin-manager/attendance-management/attendance-management.component';
import { AttendanceReportManagementComponent } from './admin-manager/attendance-report-management/attendance-report-management.component';
import { LeaveBalanceManagementComponent } from './admin-manager/leave-balance-management/leave-balance-management.component';
import { LeaveRequestManagementComponent } from './admin-manager/leave-request-management/leave-request-management.component';
import { ShiftManagementComponent } from './admin-manager/shift-management/shift-management.component';
import { AddAttendanceComponent } from './employee/add-attendance/add-attendance.component';
import { ViewAttendanceComponent } from './employee/view-attendance/view-attendance.component';
import { ViewLeaveBalanceComponent } from './employee/view-leave-balance/view-leave-balance.component';
import { ViewLeaveRequestComponent } from './employee/view-leave-request/view-leave-request.component';
import { RoleManagementComponent } from './admin-manager/role-management/role-management.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ViewMyShiftComponent } from './employee/view-my-shift/view-my-shift.component';
import { ReqSwapShiftComponent } from './employee/req-swap-shift/req-swap-shift.component';
import { ViewSwapShiftReqComponent } from './employee/view-swap-shift-req/view-swap-shift-req.component';
import { SwapShiftManagementComponent } from './admin-manager/swap-shift-management/swap-shift-management.component';
import { ReqResetPasswordComponent } from './Auth/req-reset-password/req-reset-password.component';
import { ResetPasswordComponent } from './Auth/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    ExampleComponent,
    LoginComponent,
    HomeComponent,
    AboutUsComponent,
    ContactUsComponent,
    EmployeeManagementComponent,
    AddLeaveRequestComponent,
    AttendanceManagementComponent,
    AttendanceReportManagementComponent,
    LeaveBalanceManagementComponent,
    LeaveRequestManagementComponent,
    ShiftManagementComponent,
    AddAttendanceComponent,
    ViewAttendanceComponent,
    ViewLeaveBalanceComponent,
    ViewLeaveRequestComponent,
    RoleManagementComponent,
    HeaderComponent,
    FooterComponent,
    ViewMyShiftComponent,
    ReqSwapShiftComponent,
    ViewSwapShiftReqComponent,
    SwapShiftManagementComponent,
    ReqResetPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
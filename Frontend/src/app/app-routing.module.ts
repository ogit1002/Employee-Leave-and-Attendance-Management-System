import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// General pages
import { ExampleComponent } from './components/example/example.component';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component'; 
import { ContactUsComponent } from './components/contact-us/contact-us.component'; 

// Auth
import { LoginComponent } from './Auth/login/login.component';
import { ReqResetPasswordComponent } from './Auth/req-reset-password/req-reset-password.component';
import { ResetPasswordComponent } from './Auth/reset-password/reset-password.component';
import { AuthGuard } from '../app/Auth/auth.guard';

// Admin/Manager features
import { EmployeeManagementComponent } from './admin-manager/employee-management/employee-management.component';
import { AttendanceManagementComponent } from './admin-manager/attendance-management/attendance-management.component';
import { AttendanceReportManagementComponent } from './admin-manager/attendance-report-management/attendance-report-management.component';
import { LeaveBalanceManagementComponent } from './admin-manager/leave-balance-management/leave-balance-management.component';
import { SwapShiftManagementComponent } from './admin-manager/swap-shift-management/swap-shift-management.component';
import { LeaveRequestManagementComponent } from './admin-manager/leave-request-management/leave-request-management.component';
import { RoleManagementComponent } from './admin-manager/role-management/role-management.component';
import { ShiftManagementComponent } from './admin-manager/shift-management/shift-management.component';

// Employee features
import { AddAttendanceComponent } from './employee/add-attendance/add-attendance.component';
import { AddLeaveRequestComponent } from './employee/add-leave-request/add-leave-request.component';
import { ViewAttendanceComponent } from './employee/view-attendance/view-attendance.component';
import { ReqSwapShiftComponent } from './employee/req-swap-shift/req-swap-shift.component';
import { ViewLeaveBalanceComponent } from './employee/view-leave-balance/view-leave-balance.component';
import { ViewLeaveRequestComponent } from './employee/view-leave-request/view-leave-request.component';
import { ViewMyShiftComponent } from './employee/view-my-shift/view-my-shift.component';
import { ViewSwapShiftReqComponent } from './employee/view-swap-shift-req/view-swap-shift-req.component';

// Route RBAC utility
function rbac(roles: string[]) {
  return { canActivate: [AuthGuard], data: { roles } };
}

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'example', component: ExampleComponent },
  { path: 'home', component: HomeComponent },
  { path: 'aboutUs', component: AboutUsComponent },
  { path: 'contactUs', component: ContactUsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'req-reset-password', component: ReqResetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Admin/Manager RBAC routes
  { path: 'employee-management', component: EmployeeManagementComponent, ...rbac(['Admin', 'Manager']) },
  { path: 'attendance-management', component: AttendanceManagementComponent, ...rbac(['Admin', 'Manager']) },
  { path: 'attendance-report-management', component: AttendanceReportManagementComponent, ...rbac(['Admin', 'Manager']) },
  { path: 'swap-shift-management', component: SwapShiftManagementComponent, ...rbac(['Admin', 'Manager']) },
  { path: 'leave-request-management', component: LeaveRequestManagementComponent, ...rbac(['Admin', 'Manager']) },
  { path: 'shift-management', component: ShiftManagementComponent, ...rbac(['Admin', 'Manager']) },

  // Admin only
  { path: 'role-management', component: RoleManagementComponent, ...rbac(['Admin']) },

  // Features accessible by Admin/Manager/Employee
  { path: 'leave-balance-management', component: LeaveBalanceManagementComponent, ...rbac(['Admin', 'Manager', 'Employee']) },

  // Employee-only routes
  { path: 'add-attendance', component: AddAttendanceComponent, ...rbac(['Employee']) },
  { path: 'add-leave-request', component: AddLeaveRequestComponent, ...rbac(['Employee']) },
  { path: 'view-attendance', component: ViewAttendanceComponent, ...rbac(['Employee']) },
  { path: 'req-swap-shift', component: ReqSwapShiftComponent, ...rbac(['Employee']) },
  { path: 'view-leave-balance', component: ViewLeaveBalanceComponent, ...rbac(['Employee']) },
  { path: 'view-leave-request', component: ViewLeaveRequestComponent, ...rbac(['Employee']) },
  { path: 'view-my-shift', component: ViewMyShiftComponent, ...rbac(['Employee']) },
  { path: 'view-swap-shift-req', component: ViewSwapShiftReqComponent, ...rbac(['Employee']) },

  // Fallback
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
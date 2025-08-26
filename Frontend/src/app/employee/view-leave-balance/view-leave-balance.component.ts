import { Component, OnInit } from '@angular/core';
import { LeaveBalanceService, LeaveBalanceDTO } from '../../services/leave-balance.service';
import { AuthService } from '../../services/auth.service';

type UserRole = 'Admin' | 'Manager' | 'Employee';

@Component({
  selector: 'app-view-leave-balance',
  templateUrl: './view-leave-balance.component.html',
  styleUrls: ['./view-leave-balance.component.css']
})
export class ViewLeaveBalanceComponent implements OnInit {
  role: UserRole = 'Employee';
  leaveBalances: LeaveBalanceDTO[] = [];
  error: string = '';
  loading: boolean = false;

  constructor(
    private leaveBalanceService: LeaveBalanceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setRoleFromAuth();
    if (this.canViewOwn()) {
      this.getMyLeaveBalance();
    }
  }

  setRoleFromAuth(): void {
    const roles = this.authService.getRoles().map(r => r.toLowerCase());
    if (roles.includes('admin')) this.role = 'Admin';
    else if (roles.includes('manager')) this.role = 'Manager';
    else this.role = 'Employee';
  }

  canViewOwn(): boolean {
    return this.role === 'Employee' || this.role === 'Manager';
  }

  getMyLeaveBalance() {
    this.loading = true;
    this.error = '';
    this.leaveBalanceService.GetMyLeaveBalance().subscribe({
      next: (data: LeaveBalanceDTO[]) => {
        this.leaveBalances = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load your leave balances.';
        this.loading = false;
      }
    });
  }
}
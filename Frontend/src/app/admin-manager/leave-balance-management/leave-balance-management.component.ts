import { Component, OnInit, OnDestroy } from '@angular/core';
import { LeaveBalanceService, LeaveBalanceDTO, UpdateLeaveBalanceDTO } from '../../services/leave-balance.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

type UserRole = 'Admin' | 'Manager' | 'Employee';

@Component({
  selector: 'app-leave-balance-management',
  templateUrl: './leave-balance-management.component.html',
  styleUrls: ['./leave-balance-management.component.css']
})
export class LeaveBalanceManagementComponent implements OnInit, OnDestroy {
  roles: UserRole[] = [];

  leaveBalances: LeaveBalanceDTO[] = [];
  myLeaveBalances: LeaveBalanceDTO[] = [];
  selectedLeaveBalance: LeaveBalanceDTO | null = null;
  newLeaveBalance: LeaveBalanceDTO = { leaveBalanceID: 0, employeeID: 0, leaveType: '', balance: 0 };
  searchLeaveBalanceId: number | null = null;

  updateLeaveBalanceDto: UpdateLeaveBalanceDTO = { leaveType: '', balance: 0 };
  updateId: number | null = null;

  leaveTypeOptions = ['Sick', 'Casual', 'Personal'];

  error: string = '';
  success: string = '';

  showSuccessModal = false;
  successMessage = '';

  private roleSub: Subscription | undefined;

  constructor(
    private leaveBalanceService: LeaveBalanceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to AuthService roles for instant updates
    this.roleSub = this.authService.getRoles$().subscribe(rolesArr => {
      this.roles = rolesArr.map(r => {
        const lower = r.toLowerCase();
        if (lower === 'admin') return 'Admin';
        if (lower === 'manager') return 'Manager';
        if (lower === 'employee') return 'Employee';
        return null;
      }).filter(r => r !== null) as UserRole[];
      // After setting roles, fetch data if necessary
      if (this.canViewAll()) {
        this.getAllLeaveBalances();
      }
      if (this.canGetMy()) {
        this.GetMyLeaveBalance();
      }
    });
  }

  ngOnDestroy(): void {
    this.roleSub?.unsubscribe();
  }

  // Role-based permissions
  canAdd(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('Employee');
  }
  canViewAll(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('Manager');
  }
  canViewById(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('Manager');
  }
  canUpdate(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('Manager');
  }
  canDelete(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('Manager');
  }
  canGetMy(): boolean {
    // Allow Employee, Manager, Admin
    return this.roles.includes('Manager') || this.roles.includes('Employee') || this.roles.includes('Admin');
  }

  getAllLeaveBalances(): void {
    this.error = '';
    if (!this.canViewAll()) return;
    this.leaveBalanceService.getAllLeaveBalances().subscribe({
      next: data => this.leaveBalances = data,
      error: () => this.error = 'Failed to load leave balances'
    });
  }

  getLeaveBalanceById(): void {
    this.error = '';
    this.success = '';
    this.selectedLeaveBalance = null;
    if (!this.canViewById() || this.searchLeaveBalanceId == null) return;
    this.leaveBalanceService.getLeaveBalanceById(this.searchLeaveBalanceId).subscribe({
      next: data => this.selectedLeaveBalance = data,
      error: () => {
        this.error = 'Leave balance not found';
        this.selectedLeaveBalance = null;
      }
    });
  }

  addLeaveBalance(): void {
    this.error = '';
    this.success = '';
    if (!this.canAdd()) return;
    if (!this.newLeaveBalance.employeeID || !this.newLeaveBalance.leaveType || this.newLeaveBalance.balance == null) {
      this.error = 'All fields are required and Employee ID must not be empty or zero.';
      return;
    }
    this.newLeaveBalance.employeeID = Number(this.newLeaveBalance.employeeID);

    this.leaveBalanceService.addLeaveBalance(this.newLeaveBalance).subscribe({
      next: () => {
        this.successMessage = 'Leave balance added successfully!';
        this.showSuccessModal = true;
        if (this.canViewAll()) this.getAllLeaveBalances();
        if (this.canGetMy()) this.GetMyLeaveBalance();
        this.newLeaveBalance = { leaveBalanceID: 0, employeeID: 0, leaveType: '', balance: 0 };
      },
      error: () => this.error = 'Failed to add leave balance'
    });
  }

  prepareUpdate(lb: LeaveBalanceDTO): void {
    this.updateId = lb.leaveBalanceID;
    this.updateLeaveBalanceDto = {
      leaveType: lb.leaveType,
      balance: lb.balance
    };
  }

  updateLeaveBalance(): void {
    this.error = '';
    this.success = '';
    if (!this.canUpdate() || this.updateId === null) return;

    this.leaveBalanceService.updateLeaveBalance(this.updateId, this.updateLeaveBalanceDto).subscribe({
      next: () => {
        this.successMessage = 'Leave balance updated successfully!';
        this.showSuccessModal = true;
        if (this.canViewAll()) this.getAllLeaveBalances();
        if (this.canGetMy()) this.GetMyLeaveBalance();
        this.updateId = null;
      },
      error: () => this.error = 'Failed to update leave balance'
    });
  }

  deleteLeaveBalance(id: number): void {
    this.error = '';
    this.success = '';
    if (!this.canDelete()) return;
    this.leaveBalanceService.deleteLeaveBalance(id).subscribe({
      next: () => {
        this.successMessage = 'Leave balance deleted successfully!';
        this.showSuccessModal = true;
        if (this.canViewAll()) this.getAllLeaveBalances();
        if (this.canGetMy()) this.GetMyLeaveBalance();
        if (this.selectedLeaveBalance && this.selectedLeaveBalance.leaveBalanceID === id) {
          this.selectedLeaveBalance = null;
        }
      },
      error: () => this.error = 'Failed to delete leave balance'
    });
  }

  GetMyLeaveBalance(): void {
    this.error = '';
    if (!this.canGetMy()) return;
    this.leaveBalanceService.GetMyLeaveBalance().subscribe({
      next: data => this.myLeaveBalances = data,
      error: () => this.error = 'Failed to load your leave balances'
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}
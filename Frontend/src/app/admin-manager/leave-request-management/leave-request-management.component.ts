import { Component, OnInit } from '@angular/core';
import { LeaveRequestService, LeaveRequestDTO } from 'src/app/services/leave-request.service';

type UserRole = 'admin' | 'manager' | 'employee';

@Component({
  selector: 'app-leave-request-management',
  templateUrl: './leave-request-management.component.html',
  styleUrls: ['./leave-request-management.component.css']
})
export class LeaveRequestManagementComponent implements OnInit {
  role: UserRole = 'admin';

  leaveRequests: LeaveRequestDTO[] = [];
  myLeaveRequests: LeaveRequestDTO[] = [];
  newLeaveRequest: LeaveRequestDTO = { employeeID: 0, leaveType: '', startDate: '', endDate: '', status: 'Pending' };
  updateLeaveRequest: LeaveRequestDTO = { employeeID: 0, leaveType: '', startDate: '', endDate: '', status: '' };
  updateId: number | null = null;
  showUpdateLeaveModal = false; // Modal control

  statusOptions = ['Approved', 'Pending', 'Rejected'];

  error: string = '';
  success: string = '';

  // Success Modal
  showSuccessModal = false; // Controls the visibility of the success modal
  successMessage = ''; // Stores the success message to display in the modal

  constructor(private leaveRequestService: LeaveRequestService) {}

  ngOnInit(): void {
    if (this.canViewAll()) {
      this.getAllLeaveRequests();
    }
    if (this.canGetMy()) {
      this.getMyLeaveRequests();
    }
  }

  canAdd(): boolean {
    return this.role === 'admin' || this.role === 'manager' || this.role === 'employee';
  }
  canViewAll(): boolean {
    return this.role === 'admin' || this.role === 'manager';
  }
  canUpdate(): boolean {
    return this.role === 'admin' || this.role === 'manager';
  }
  canDelete(): boolean {
    return this.role === 'admin' || this.role === 'manager';
  }
  canGetMy(): boolean {
    return true;
  }

  getAllLeaveRequests(): void {
    this.error = '';
    this.success = '';
    if (!this.canViewAll()) return;
    this.leaveRequestService.getAllLeaveRequests().subscribe({
      next: (data: LeaveRequestDTO[]) => this.leaveRequests = data,
      error: () => console.error('Failed to load leave requests') // Log error instead of showing modal
    });
  }

  getMyLeaveRequests(): void {
    this.error = '';
    this.success = '';
    if (!this.canGetMy()) return;
    this.leaveRequestService.getMyLeaveRequests().subscribe({
      next: (data: LeaveRequestDTO[]) => this.myLeaveRequests = data,
      error: () => console.error('Failed to load your leave requests') // Log error instead of showing modal
    });
  }

  addLeaveRequest(): void {
    this.error = '';
    this.success = '';
    if (!this.canAdd()) return;

    if (!this.newLeaveRequest.leaveType || !this.newLeaveRequest.startDate || !this.newLeaveRequest.endDate) {
      this.error = 'Please fill all fields.';
      return;
    }

    this.leaveRequestService.addLeaveRequest(this.newLeaveRequest).subscribe({
      next: () => {
        this.successMessage = 'Leave request submitted successfully!';
        this.showSuccessModal = true; // Show success modal
        if (this.canViewAll()) this.getAllLeaveRequests();
        if (this.canGetMy()) this.getMyLeaveRequests();
        this.newLeaveRequest = { employeeID: 0, leaveType: '', startDate: '', endDate: '', status: 'Pending' };
      },
      error: (err) => {
        // Attempt to get the error message from the backend
        const msg = err?.error?.message || err?.error || err?.message || '';
        if (typeof msg === 'string' && msg.toLowerCase().includes('balance')) {
          this.error = 'Leave balance not sufficient. Please check your leave balance.';
        } else {
          this.error = 'Failed to submit leave request';
        }
      }
    });
  }

  prepareUpdate(lr: LeaveRequestDTO): void {
    this.updateId = lr.leaveID ?? null;
    this.updateLeaveRequest = { ...lr };
    if (!this.updateLeaveRequest.status) {
      this.updateLeaveRequest.status = 'Pending';
    }
    this.showUpdateLeaveModal = true;
  }

  closeUpdateLeaveModal(): void {
    this.showUpdateLeaveModal = false;
    this.updateId = null;
  }

  updateLeaveRequestFunc(): void {
    this.error = '';
    this.success = '';
    if (!this.canUpdate() || this.updateId === null) return;

    if (!this.updateLeaveRequest.leaveType || !this.updateLeaveRequest.startDate || !this.updateLeaveRequest.endDate) {
      this.error = 'Please fill all fields.';
      return;
    }

    this.leaveRequestService.updateLeaveRequest(this.updateId, this.updateLeaveRequest).subscribe({
      next: () => {
        this.successMessage = 'Leave request updated successfully!';
        this.showSuccessModal = true; // Show success modal
        if (this.canViewAll()) this.getAllLeaveRequests();
        if (this.canGetMy()) this.getMyLeaveRequests();
        this.closeUpdateLeaveModal();
      },
      error: () => this.error = 'Failed to update leave request'
    });
  }

  deleteLeaveRequest(id?: number): void {
    this.error = '';
    this.success = '';
    if (!this.canDelete() || id == null) return;
    this.leaveRequestService.deleteLeaveRequest(id).subscribe({
      next: () => {
        this.successMessage = 'Leave request deleted successfully!';
        this.showSuccessModal = true; // Show success modal
        if (this.canViewAll()) this.getAllLeaveRequests();
        if (this.canGetMy()) this.getMyLeaveRequests();
      },
      error: () => this.error = 'Failed to delete leave request'
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false; // Close the success modal
  }
}
import { Component } from '@angular/core';
import { LeaveRequestService, LeaveRequestDTO } from 'src/app/services/leave-request.service';

@Component({
  selector: 'app-add-leave-request',
  templateUrl: './add-leave-request.component.html',
  styleUrls: ['./add-leave-request.component.css']
})
export class AddLeaveRequestComponent {
  leaveRequest: LeaveRequestDTO = {
    employeeID: 0,
    leaveType: '',
    startDate: '',
    endDate: ''
  };
  error: string = '';
  success: string = '';

  constructor(private leaveRequestService: LeaveRequestService) {}

  submitLeaveRequest(): void {
    this.error = '';
    this.success = '';
    if (
      !this.leaveRequest.employeeID ||
      !this.leaveRequest.leaveType.trim() ||
      !this.leaveRequest.startDate ||
      !this.leaveRequest.endDate
    ) {
      this.error = 'All fields are required.';
      return;
    }

    this.leaveRequestService.addLeaveRequest(this.leaveRequest).subscribe({
      next: () => {
        this.success = 'Leave request submitted successfully';
        this.leaveRequest = { employeeID: 0, leaveType: '', startDate: '', endDate: '' };
      },
      error: (err) => {
        if (err?.error?.message && err.error.message.includes('Insufficient leave balance')) {
          this.error = err.error.message;
        } else {
          this.error = 'Failed to submit leave request';
        }
      }
    });
  }
}
import { Component } from '@angular/core';
import { AttendanceService, AttendanceDTO } from '../../services/attendance.service';

type UserRole = 'admin' | 'manager' | 'employee';

@Component({
  selector: 'app-add-attendance',
  templateUrl: './add-attendance.component.html',
  styleUrls: ['./add-attendance.component.css']
})
export class AddAttendanceComponent {
  // Simulate user role; in real app, get from AuthService
  role: UserRole = 'admin'; // Change as needed for testing

  attendance: AttendanceDTO = {
    employeeId: 0,
    clockInTime: '',
    clockOutTime: ''
  };

  success = '';
  error = '';

  constructor(private attendanceService: AttendanceService) {}

  canAdd(): boolean {
    return this.role === 'admin' || this.role === 'manager' || this.role === 'employee';
  }

  addAttendance() {
    this.success = '';
    this.error = '';

    if (!this.canAdd()) {
      this.error = 'You do not have permission to add attendance.';
      return;
    }

    // Basic validation
    if (!this.attendance.employeeId || !this.attendance.clockInTime || !this.attendance.clockOutTime) {
      this.error = 'All fields are required.';
      return;
    }

    // Optional: Validate that clockOutTime is after clockInTime
    if (new Date(this.attendance.clockOutTime) <= new Date(this.attendance.clockInTime)) {
      this.error = 'Clock-out time must be after clock-in time.';
      return;
    }

    this.attendanceService.addAttendance(this.attendance).subscribe({
      next: () => {
        this.success = 'Attendance added successfully.';
        this.attendance = { employeeId: 0, clockInTime: '', clockOutTime: '' };
      },
      error: (err) => {
        this.error = err?.error || 'Failed to add attendance.';
      }
    });
  }
}
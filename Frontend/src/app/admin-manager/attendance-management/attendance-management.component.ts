import { Component, OnInit } from '@angular/core';
import { AttendanceService, AttendanceDTO, UpdateAttendanceDTO } from '../../services/attendance.service';
import { AuthService } from '../../services/auth.service';

type UserRole = 'Admin' | 'Manager' | 'Employee';

@Component({
  selector: 'app-attendance-management',
  templateUrl: './attendance-management.component.html',
  styleUrls: ['./attendance-management.component.css']
})
export class AttendanceManagementComponent implements OnInit {
  attendances: any[] = [];
  myAttendances: any[] = [];
  selectedAttendance: any = null;
  newAttendance: AttendanceDTO = { employeeId: 0, clockInTime: '', clockOutTime: '' };
  updateAttendanceData: UpdateAttendanceDTO = { clockInTime: '', clockOutTime: '' };
  userRole: UserRole = 'Employee';
  loading = false;
  error = '';
  success = '';

  // For Fetch Attendance By ID
  attendanceIdToFetch: number | null = null;
  fetchedAttendance: any = null;
  fetchAttendanceError: string = '';

  // Success Modal
  showSuccessModal = false; // Controls the visibility of the success modal
  successMessage = ''; // Stores the success message to display in the modal

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.setUserRoleAndFetch();
  }

  setUserRoleAndFetch() {
    const roles = this.authService.getRoles().map((r: string) => r.toLowerCase());
    if (roles.includes('admin')) {
      this.userRole = 'Admin';
    } else if (roles.includes('manager')) {
      this.userRole = 'Manager';
    } else {
      this.userRole = 'Employee';
    }
    this.fetchAttendanceData();
  }

  fetchAttendanceData() {
    this.loading = true;
    this.error = '';
    this.success = '';
    if (this.userRole === 'Admin' || this.userRole === 'Manager') {
      this.attendanceService.getAllAttendance().subscribe({
        next: data => {
          this.attendances = data;
          this.loading = false;
        },
        error: err => {
          this.error = 'Failed to fetch attendance records.';
          this.loading = false;
        }
      });
    } else if (this.userRole === 'Employee') {
      this.attendanceService.getMyAttendance().subscribe({
        next: data => {
          this.myAttendances = data;
          this.loading = false;
        },
        error: err => {
          this.error = 'Failed to fetch your attendance records.';
          this.loading = false;
        }
      });
    }
  }

  // Fetch Attendance By ID logic
  getAttendanceById() {
    this.fetchAttendanceError = '';
    this.fetchedAttendance = null;
    if (!this.attendanceIdToFetch) {
      this.fetchAttendanceError = 'Please enter a valid Attendance ID.';
      return;
    }
    this.attendanceService.getAttendanceById(this.attendanceIdToFetch).subscribe({
      next: data => {
        this.fetchedAttendance = data;
        this.fetchAttendanceError = '';
      },
      error: err => {
        this.fetchedAttendance = null;
        this.fetchAttendanceError = err?.error?.message || 'Attendance not found.';
      }
    });
  }

  // Admin/Manager: Add attendance
  addAttendance() {
    this.loading = true;
    this.attendanceService.addAttendance(this.newAttendance).subscribe({
      next: () => {
        this.successMessage = 'Attendance added successfully!';
        this.showSuccessModal = true; // Show success modal
        this.newAttendance = { employeeId: 0, clockInTime: '', clockOutTime: '' };
        this.fetchAttendanceData();
      },
      error: () => {
        this.error = 'Failed to add attendance.';
        this.loading = false;
      }
    });
  }

  // Admin/Manager: Select attendance for update
  selectAttendance(attendance: any) {
    this.selectedAttendance = attendance;
    // Ensure correct value format for datetime-local (YYYY-MM-DDTHH:mm)
    this.updateAttendanceData = {
      clockInTime: attendance.clockInTime ? attendance.clockInTime.substring(0, 16) : '',
      clockOutTime: attendance.clockOutTime ? attendance.clockOutTime.substring(0, 16) : ''
    };
  }

  // Admin/Manager: Update attendance
  updateAttendance() {
    if (!this.selectedAttendance) return;
    this.loading = true;
    this.attendanceService.updateAttendance(this.selectedAttendance.attendanceID, this.updateAttendanceData).subscribe({
      next: () => {
        this.successMessage = 'Attendance updated successfully!';
        this.showSuccessModal = true; // Show success modal
        this.selectedAttendance = null;
        this.fetchAttendanceData();
      },
      error: () => {
        this.error = 'Failed to update attendance.';
        this.loading = false;
      }
    });
  }

  // Only Admin: Delete attendance
  deleteAttendance(id: number) {
    if (this.userRole !== 'Admin') return;
    if (!confirm('Are you sure you want to delete this attendance record?')) return;
    this.loading = true;
    this.attendanceService.deleteAttendanceById(id).subscribe({
      next: () => {
        this.successMessage = 'Attendance deleted successfully!';
        this.showSuccessModal = true; // Show success modal
        this.attendances = this.attendances.filter(a => a.attendanceID !== id);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to delete attendance.';
        this.loading = false;
      }
    });
  }

  cancelUpdate() {
    this.selectedAttendance = null;
  }

  closeSuccessModal() {
    this.showSuccessModal = false; // Close the success modal
  }
}
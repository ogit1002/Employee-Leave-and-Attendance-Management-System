import { Component, OnInit } from '@angular/core';
import { AttendanceService, AttendanceDTO } from '../../services/attendance.service';

type UserRole = 'admin' | 'manager' | 'employee';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.css']
})
export class ViewAttendanceComponent implements OnInit {
  role: UserRole = 'employee'; // Change as needed for testing

  attendances: AttendanceDTO[] = [];
  error: string = '';
  loading: boolean = false;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    if (this.canViewOwn()) {
      this.getMyAttendance();
    }
  }

  canViewOwn(): boolean {
    return this.role === 'employee';
  }

  getMyAttendance() {
    this.loading = true;
    this.error = '';
    this.attendanceService.getMyAttendance().subscribe({
      next: (data: AttendanceDTO[]) => {
        this.attendances = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load your attendance records.';
        this.loading = false;
      }
    });
  }

  // Helper to show work hours as HH:mm
  getWorkHours(clockIn: string, clockOut: string): string {
    const inDate = new Date(clockIn);
    const outDate = new Date(clockOut);
    if (isNaN(inDate.valueOf()) || isNaN(outDate.valueOf())) return '';
    const diffMs = outDate.getTime() - inDate.getTime();
    if (diffMs <= 0) return '';
    const diffH = Math.floor(diffMs / 3600000);
    const diffM = Math.floor((diffMs % 3600000) / 60000);
    return `${diffH}h ${diffM}m`;
  }
}
import { Component, OnInit } from '@angular/core';
import { AttendanceReportService, AttendanceReportDTO } from '../../services/attendance-report.service';
import { AuthService } from '../../services/auth.service';

type UserRole = 'admin' | 'manager' | 'employee';

@Component({
  selector: 'app-attendance-report-management',
  templateUrl: './attendance-report-management.component.html',
  styleUrls: ['./attendance-report-management.component.css']
})
export class AttendanceReportManagementComponent implements OnInit {
  role: UserRole = 'employee'; // Will be set dynamically
  reports: AttendanceReportDTO[] = [];
  selectedReport: AttendanceReportDTO | null = null;
  newReport: AttendanceReportDTO = { employeeID: 0, dateRange: 0, totalAttendance: 0, absenteeism: 0 };
  updateReport: AttendanceReportDTO = { employeeID: 0, dateRange: 0, totalAttendance: 0, absenteeism: 0 };
  updateId: number | null = null;

  error: string = '';
  success: string = '';

  // Success Modal
  showSuccessModal = false; // Controls the visibility of the success modal
  successMessage = ''; // Stores the success message to display in the modal

  constructor(
    private reportService: AttendanceReportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setUserRoleAndFetch();
  }

  setUserRoleAndFetch() {
    const roles = this.authService.getRoles();
    if (roles.includes('admin') || roles.includes('Admin')) {
      this.role = 'admin';
    } else if (roles.includes('manager') || roles.includes('Manager')) {
      this.role = 'manager';
    } else {
      this.role = 'employee';
    }
    if (this.canView()) {
      this.getAllReports();
    }
  }

  // Role checks
  canAdd(): boolean {
    return this.role === 'admin' || this.role === 'manager';
  }
  canView(): boolean {
    return this.role === 'admin' || this.role === 'manager';
  }
  canUpdate(): boolean {
    return this.role === 'admin';
  }
  canDelete(): boolean {
    return this.role === 'admin' || this.role === 'manager';
  }

  // CRUD Operations

  getAllReports(): void {
    this.error = '';
    this.success = '';
    if (!this.canView()) return;
    this.reportService.getAllAttendanceReport().subscribe({
      next: data => this.reports = data,
      error: err => this.error = 'Failed to load reports'
    });
  }

  getReportById(id: number): void {
    this.error = '';
    this.success = '';
    if (!this.canView()) return;
    this.reportService.getAttendanceReportById(id).subscribe({
      next: data => this.selectedReport = data,
      error: err => this.error = 'Report not found'
    });
  }

  addAttendanceReport(): void {
    this.error = '';
    this.success = '';
    if (!this.canAdd()) return;
    if (
      !this.newReport.employeeID ||
      !this.newReport.dateRange ||
      this.newReport.totalAttendance === undefined || this.newReport.totalAttendance === null ||
      this.newReport.absenteeism === undefined || this.newReport.absenteeism === null
    ) {
      this.error = 'All fields are required and Employee ID must not be empty or zero.';
      return;
    }
    this.newReport.employeeID = Number(this.newReport.employeeID);

    this.reportService.addAttendanceReport(this.newReport).subscribe({
      next: () => {
        this.successMessage = 'Report added successfully!';
        this.showSuccessModal = true; // Show success modal
        this.getAllReports();
        this.newReport = { employeeID: 0, dateRange: 0, totalAttendance: 0, absenteeism: 0 };
      },
      error: err => this.error = 'Failed to add report'
    });
  }

  prepareUpdate(report: AttendanceReportDTO): void {
    this.updateId = report.reportID || report.employeeID;
    this.updateReport = {
      reportID: report.reportID, // Optional, backend might ignore
      employeeID: report.employeeID,
      dateRange: report.dateRange,
      totalAttendance: report.totalAttendance,
      absenteeism: report.absenteeism
    };
  }

  updateAttendanceReport(): void {
    this.error = '';
    this.success = '';
    if (!this.canUpdate() || this.updateId === null) return;
    this.updateReport.employeeID = Number(this.updateReport.employeeID);

    this.reportService.updateAttendanceReport(this.updateId, this.updateReport).subscribe({
      next: () => {
        this.successMessage = 'Report updated successfully!';
        this.showSuccessModal = true; // Show success modal
        this.getAllReports();
        this.updateId = null;
      },
      error: err => this.error = 'Failed to update report'
    });
  }

  deleteAttendanceReport(id: number): void {
    this.error = '';
    this.success = '';
    if (!this.canDelete()) return;
    this.reportService.deleteAttendanceReport(id).subscribe({
      next: () => {
        this.successMessage = 'Report deleted successfully!';
        this.showSuccessModal = true; // Show success modal
        this.reports = this.reports.filter(r => (r.reportID || r.employeeID) !== id);
        this.getAllReports();
      },
      error: err => this.error = 'Failed to delete report'
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false; // Close the success modal
  }
}
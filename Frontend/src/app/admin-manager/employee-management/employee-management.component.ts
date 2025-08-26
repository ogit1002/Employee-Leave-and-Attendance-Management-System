import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EmployeeService, Employee, EmployeeRegisterDTO } from '../../services/employee.service';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css']
})
export class EmployeeManagementComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  newEmployee: Partial<EmployeeRegisterDTO> = {};
  editEmployee: Partial<Employee> = {};
  roles: string[] = [];
  isAdminOrManager = false;
  isAdmin = false;
  error = '';
  success = '';
  showSuccessModal = false; // Controls the visibility of the success modal
  successMessage = ''; // Stores the success message to display in the modal

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.roles = this.authService.getRoles();
    this.isAdminOrManager = this.roles.includes('Admin') || this.roles.includes('Manager');
    this.isAdmin = this.roles.includes('Admin');
    if (this.isAdminOrManager) {
      this.getAllEmployees();
    } else {
      this.error = 'You are not authorized to view this page.';
    }
  }

  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = [...data];
        this.cdr.detectChanges();
      },
      error: () => (this.error = 'Failed to load employees.')
    });
  }

  getEmployeeById(id: string | number) {
    const empId = typeof id === 'string' ? Number(id) : id;
    this.error = '';
    this.success = '';
    this.employeeService.getEmployeeById(empId).subscribe({
      next: (data) => (this.selectedEmployee = { ...data }),
      error: () => (this.error = 'Employee not found.')
    });
  }

  addEmployee() {
    this.error = '';
    this.success = '';
    if (!this.newEmployee.name || !this.newEmployee.email || !this.newEmployee.address) {
      this.error = 'All fields are required.';
      return;
    }
    this.employeeService.addEmployee(this.newEmployee as EmployeeRegisterDTO).subscribe({
      next: (res) => {
        const msg = res?.message || 'Employee registered successfully.';
        const pwd = res?.password ? ` Default password: ${res.password}` : '';
        this.successMessage = msg + pwd;
        this.showSuccessModal = true; // Show success modal
        this.newEmployee = {};
        this.getAllEmployees();
      },
      error: (err) => {
        this.error =
          err?.error?.title ||
          err?.error?.errors?.[Object.keys(err.error.errors)[0]]?.[0] ||
          'Failed to add employee.';
        console.error(err);
      }
    });
  }

  startEdit(emp: Employee) {
    this.editEmployee = { ...emp };
  }

  updateEmployee() {
    this.error = '';
    this.success = '';
    if (!this.editEmployee.id) return;
    if (!this.editEmployee.name || !this.editEmployee.email || !this.editEmployee.address) {
      this.error = 'All fields are required.';
      return;
    }
    this.employeeService.updateEmployee(this.editEmployee.id, this.editEmployee as EmployeeRegisterDTO).subscribe({
      next: () => {
        this.successMessage = 'Employee updated successfully!';
        this.showSuccessModal = true; // Show success modal
        this.editEmployee = {};
        this.getAllEmployees();
      },
      error: (err) => {
        this.error =
          err?.error?.title ||
          err?.error?.errors?.[Object.keys(err.error.errors)[0]]?.[0] ||
          'Failed to update employee.';
        console.error(err);
      }
    });
  }

  deleteEmployee(id: number) {
    if (!confirm('Click Ok to delete the employee')) return;
    this.error = '';
    this.success = '';
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.successMessage = 'Employee deleted successfully!';
        this.showSuccessModal = true; // Show success modal
        this.employees = this.employees.filter((emp) => emp.id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.error =
          err?.error?.title ||
          err?.error?.errors?.[Object.keys(err.error.errors)[0]]?.[0] ||
          'Failed to delete employee.';
      }
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false; // Close the success modal
  }
}
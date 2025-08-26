import { Component } from '@angular/core';
import { RolesService, UserRoleDTO } from '../../services/roles.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent {
  currentUserRole: string = 'Admin';

  newRoleName: string = '';
  createRoleSuccess: string = '';
  createRoleError: string = '';

  assignRoleSuccess: string = '';
  assignRoleError: string = '';

  availableRoles: string[] = ['Admin', 'Manager', 'Employee'];

  // Updated properties for role assignment and modal
  roleAssignment = { userEmail: '', role: '' };
  error: string = '';
  success: string = '';
  showSuccessModal: boolean = false; // Controls the visibility of the success modal
  successMessage: string = ''; // Stores the success message to display in the modal

  constructor(private rolesService: RolesService) {}

  canManageRoles(): boolean {
    return this.currentUserRole === 'Admin';
  }

  assignRole() {
    this.error = '';
    this.success = '';
    if (!this.roleAssignment.userEmail || !this.roleAssignment.role) {
      this.error = 'User Email and role are required';
      return;
    }

    const dto: UserRoleDTO = {
      email: this.roleAssignment.userEmail.trim(),
      role: this.roleAssignment.role
    };

    this.rolesService.assignRole(dto).subscribe({
      next: () => {
        this.successMessage = `Role "${this.roleAssignment.role}" assigned successfully to "${this.roleAssignment.userEmail}"!`;
        this.showSuccessModal = true; // Show success modal
        this.roleAssignment = { userEmail: '', role: '' }; // Reset form
      },
      error: () => {
        this.error = 'Failed to assign role.';
      }
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false; // Close the success modal
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, UserProfile } from '../services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  updateForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.updateForm = this.fb.group({
      primaryMobileNumber: [''],
      secondaryMobileNumber: [''],
      homeAddress: [''],
      officeAddress: [''],
      secondaryEmail: [''],
      additionalInfo: ['']
    });
  }

  ngOnInit(): void {
    // Load current user details to populate the form
    // this.loadUserDetails();
  }

  loadUserDetails(): void {
    this.isLoading = true;
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        if (response.userProfile) {
          // Update form with existing values
          this.updateForm.patchValue({
            primaryMobileNumber: response.userProfile.primaryMobileNumber || '',
            secondaryMobileNumber: response.userProfile.secondaryMobileNumber || '',
            homeAddress: response.userProfile.homeAddress || '',
            officeAddress: response.userProfile.officeAddress || '',
            secondaryEmail: response.userProfile.secondaryEmail || '',
            additionalInfo: response.userProfile.additionalInfo || ''
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user details', error);
        this.errorMessage = 'Failed to load user details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;
      
      const userProfile: UserProfile = this.updateForm.value;
      
      this.userService.updateUserDetails(userProfile).subscribe({
        next: (response) => {
          this.successMessage = 'Profile updated successfully!';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating profile', error);
          this.errorMessage = 'Failed to update profile. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  navigateToProfile(): void {
    this.router.navigate(['/user']);
  }
}
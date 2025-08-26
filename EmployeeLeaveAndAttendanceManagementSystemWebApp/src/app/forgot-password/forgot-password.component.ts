import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  resetLinkSent = false;
  resetLink = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const email = this.forgotPasswordForm.get('email')?.value;
    
    this.authService.generatePasswordResetLink(email).subscribe({
      next: (response) => {
        this.resetLinkSent = true;
        this.resetLink = response.resetLink;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'An error occurred. Please try again.';
        this.isLoading = false;
      }
    });
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.resetLink)
      .then(() => {
        alert('Reset link copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy reset link.');
      });
  }
}
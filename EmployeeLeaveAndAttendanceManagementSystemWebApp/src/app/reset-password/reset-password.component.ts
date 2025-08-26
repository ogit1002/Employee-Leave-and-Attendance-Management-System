import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  resetSuccess = false;
  errorMessage = '';
  isLoading = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      resetLink: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  parseResetLink(resetLink: string): { email: string, token: string } | null {
    try {
      const url = new URL(resetLink);
      const email = url.searchParams.get('email');
      const token = url.searchParams.get('token');
      
      if (!email || !token) {
        this.errorMessage = 'Invalid reset link. Could not extract email or token.';
        return null;
      }
      
      return { email, token };
    } catch (error) {
      this.errorMessage = 'Invalid reset link format. Please paste the entire link.';
      return null;
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    if (this.resetPasswordForm.hasError('mismatch')) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const resetLink = this.resetPasswordForm.get('resetLink')?.value;
    const parsedLink = this.parseResetLink(resetLink);
    
    if (!parsedLink) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const newPassword = this.resetPasswordForm.get('newPassword')?.value;
    
    this.authService.resetPassword(parsedLink.email, parsedLink.token, newPassword).subscribe({
      next: () => {
        this.resetSuccess = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'An error occurred. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
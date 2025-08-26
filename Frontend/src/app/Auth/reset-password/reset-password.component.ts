import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  success = '';
  error = '';
  loading = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.error = '';
    this.success = '';

    if (!this.email || !this.token || !this.newPassword || !this.confirmPassword) {
      this.error = 'All fields are required.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.loading = true;
    this.http.post<any>('https://localhost:7165/api/Auth/reset-password', {
      email: this.email,
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: (res) => {
        this.success = res?.message || 'Password has been reset successfully.';
        this.loading = false;
        this.email = '';
        this.token = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.error = err.error?.message || err.error?.title || err.error || 'Failed to reset password. Please check your information.';
        this.loading = false;
      }
    });
  }
}
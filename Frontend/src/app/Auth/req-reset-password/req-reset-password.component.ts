import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-req-reset-password',
  templateUrl: './req-reset-password.component.html',
  styleUrls: ['./req-reset-password.component.css']
})
export class ReqResetPasswordComponent {
  email = '';
  token: string | null = null;
  error = '';
  success = '';
  loading = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.error = '';
    this.success = '';
    this.token = null;
    if (!this.email) {
      this.error = 'Email is required.';
      return;
    }
    this.loading = true;
    this.http.post<any>('https://localhost:7165/api/Auth/request-password-reset', { email: this.email })
      .subscribe({
        next: (res) => {
          this.token = res.token;
          this.success = res.message || 'Token generated successfully. Copy this token and proceed to reset password.';
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || err.error?.title || err.error || 'Could not request password reset. Please try again.';
          this.loading = false;
        }
      });
  }
}
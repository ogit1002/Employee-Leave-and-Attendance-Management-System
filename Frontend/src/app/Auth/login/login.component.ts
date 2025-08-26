import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.error = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        // Save all in localStorage: token, email, roles
        this.authService.setSession(response.token, response.email, response.roles);
        this.router.navigate(['/']); // Redirect to home or dashboard
      },
      error: (err) => {
        if (err.error && err.error.title) {
          this.error = err.error.title;
        } else {
          this.error = 'Login failed. Please check your credentials.';
        }
      }
    });
  }
}
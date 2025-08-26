import { Component } from '@angular/core';
import { AuthService, RegisterRequest } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerRequest: RegisterRequest = {
    email: '',
    password: ''
  }
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if(this.registerRequest.password !== this.confirmPassword){
      this.errorMessage = 'Passwords do not match';
      return;
    }
    this.isLoading = true;

    this.authService.register(this.registerRequest).subscribe({
      next: () =>{
        this.successMessage = 'Registration successful! Redirecting to log in.....';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        if(error.error?.message){
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An error occurred during registration. Please try again.';
        }
        console.error('Registration error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}

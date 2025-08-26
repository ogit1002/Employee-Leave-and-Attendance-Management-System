import { Component, OnInit } from '@angular/core';
import { AuthService, LoginResponse } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  userInfo: LoginResponse | null = null;
  userProfile: any = null;
  claims: any[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userInfo = this.authService.currentUserValue;
    if (!this.userInfo) {
      this.router.navigate(['/login']);
    } else {
      this.fetchUserDetails();
    }
  }

  fetchUserDetails(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        this.userProfile = response.userProfile;
        this.claims = response.claims;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching user details', error);
        this.errorMessage = 'Failed to load user details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}

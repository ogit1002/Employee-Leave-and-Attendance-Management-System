import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn$!: Observable<boolean>;
  userEmail: string | null = null;
  userRoles: string[] = [];
  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();

    // Subscribe to user info for instant update
    this.subs.push(
      this.authService.getEmail$().subscribe(email => this.userEmail = email)
    );
    this.subs.push(
      this.authService.getRoles$().subscribe(roles => this.userRoles = roles)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  hasRole(role: string): boolean {
    return this.userRoles.map(r => r.toLowerCase()).includes(role.toLowerCase());
  }
}
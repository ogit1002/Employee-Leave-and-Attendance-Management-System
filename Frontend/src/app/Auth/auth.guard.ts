import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.auth.getToken();
    const userRoles = this.auth.getRoles();
    const allowedRoles = route.data['roles'] as string[] | undefined;

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // If no roles specified on route, just check login
    if (!allowedRoles || allowedRoles.length === 0) return true;

    // Allow if user has at least one allowed role
    if (allowedRoles.some(role => userRoles.includes(role))) return true;

    // Optionally, redirect to a "not authorized" page
    this.router.navigate(['/not-authorized']);
    return false;
  }
}
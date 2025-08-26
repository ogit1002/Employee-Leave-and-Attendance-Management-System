import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginRequest{
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  token: string;
  roles: string[];
}

export interface RegisterRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7165/api';

  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthState();
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/Auth/register`, request);
  }

  private checkAuthState(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  public isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
 * Check if the current user has a specific role
 * @param role The role to check for
 * @returns true if the user has the role, false otherwise
 */

  public hasRole(role: string): boolean {
    const user = this.currentUserValue;
    if (!user || !user.roles) {
      return false;
    }
    return user.roles.includes(role);
  }

  generatePasswordResetLink(email: string): Observable<{resetLink: string}> {
    return this.http.post<{resetLink: string}>(
      `${this.baseUrl}/Auth/generate-password-reset-link`,
      { email }
    );
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/Auth/reset-password`,
      { email, token, newPassword },
      // Specify that we expect a text response, not JSON
      { responseType: 'text' }
    );
  }


  public get currentUserValue(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/Auth/login`, request)
    .pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    )
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}

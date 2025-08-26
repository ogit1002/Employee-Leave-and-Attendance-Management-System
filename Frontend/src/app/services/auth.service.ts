import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  roles: string[];
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7165/api/Auth';
  private tokenKey = 'auth_token';
  private userEmailKey = 'user_email';
  private userRolesKey = 'user_roles';

  // Add BehaviorSubjects for reactive updates
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  private userEmail$ = new BehaviorSubject<string | null>(this.getEmailFromStorage());
  private userRoles$ = new BehaviorSubject<string[]>(this.getRolesFromStorage());

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    // The backend now wraps LoginResponse in { message, data }
    // We unwrap it here for convenience throughout the app
    return this.http.post<any>(`${this.apiUrl}/login`, request).pipe(
      map(response => {
        if (response && response.data) {
          return response.data as LoginResponse;
        }
        throw new Error(response?.message || 'Invalid login response');
      })
    );
  }

  setSession(token: string, email: string, roles: string[]) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userEmailKey, email);
    localStorage.setItem(this.userRolesKey, JSON.stringify(roles));
    this.loggedIn$.next(true);
    this.userEmail$.next(email);
    this.userRoles$.next(roles);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userEmailKey);
    localStorage.removeItem(this.userRolesKey);
    this.loggedIn$.next(false);
    this.userEmail$.next(null);
    this.userRoles$.next([]);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // For initializing BehaviorSubjects
  private getEmailFromStorage(): string | null {
    return localStorage.getItem(this.userEmailKey);
  }
  private getRolesFromStorage(): string[] {
    const roles = localStorage.getItem(this.userRolesKey);
    try {
      return roles ? JSON.parse(roles) : [];
    } catch {
      return [];
    }
  }

  // For immediate value
  getEmail(): string | null {
    return this.userEmail$.getValue();
  }
  getRoles(): string[] {
    return this.userRoles$.getValue();
  }
  // For reactivity
  getEmail$(): Observable<string | null> {
    return this.userEmail$.asObservable();
  }
  getRoles$(): Observable<string[]> {
    return this.userRoles$.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user-details`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response?.data ?? response)
    );
  }
}
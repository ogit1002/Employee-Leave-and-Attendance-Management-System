import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface UserRoleDTO {
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private readonly apiUrl = 'https://localhost:7165/api/Role';

  constructor(private http: HttpClient) {}

  createRole(roleName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/CreateRole`, JSON.stringify(roleName), {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(res => res?.message ?? res)
    );
  }

  assignRole(userRole: UserRoleDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AssignRole`, userRole).pipe(
      map(res => res?.message ?? res)
    );
  }
}
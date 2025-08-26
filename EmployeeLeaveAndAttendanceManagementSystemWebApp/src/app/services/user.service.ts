import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  primaryMobileNumber: string;
  secondaryMobileNumber: string;
  homeAddress: string;
  officeAddress: string;
  secondaryEmail: string;
  additionalInfo: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://localhost:7165/api';

  constructor(private http: HttpClient) { }

  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Auth/user-details`);
  }

  updateUserDetails(userProfile: UserProfile): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Auth/update-user-details`, userProfile);
  }
}

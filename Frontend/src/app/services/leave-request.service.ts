import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface LeaveRequestDTO {
  leaveID?: number; // Optional for new requests
  employeeID: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private readonly apiUrl = 'https://localhost:7165/api/LeaveRequest';

  constructor(private http: HttpClient) {}

  getAllLeaveRequests(): Observable<LeaveRequestDTO[]> {
    return this.http.get<any>(`${this.apiUrl}/GetAllLeaves`).pipe(
      map(res => res?.data ?? res)
    );
  }

  getLeaveRequestById(id: number): Observable<LeaveRequestDTO> {
    return this.http.get<any>(`${this.apiUrl}/GetLeaveById/${id}`).pipe(
      map(res => res?.data ?? res)
    );
  }

  addLeaveRequest(dto: LeaveRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddLeave`, dto).pipe(
      map(res => res?.data ?? res)
    );
  }

  updateLeaveRequest(id: number, dto: LeaveRequestDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateLeave/${id}`, dto).pipe(
      map(res => res?.data ?? res)
    );
  }

  deleteLeaveRequest(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteLeave/${id}`).pipe(
      map(res => res?.message ?? res)
    );
  }

  getMyLeaveRequests(): Observable<LeaveRequestDTO[]> {
    return this.http.get<any>(`${this.apiUrl}/GetMyLeaverequest`).pipe(
      map(res => res?.data ?? res)
    );
  }
}
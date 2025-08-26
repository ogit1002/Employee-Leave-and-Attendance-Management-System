import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface LeaveBalanceDTO {
  leaveBalanceID: number;
  employeeID: number;
  leaveType: string;
  balance: number;
}

export interface UpdateLeaveBalanceDTO {
  leaveType: string;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveBalanceService {
  private readonly apiUrl = 'https://localhost:7165/api/LeaveBalance';

  constructor(private http: HttpClient) {}

  addLeaveBalance(leaveBalance: LeaveBalanceDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddLeaveBalance`, leaveBalance)
      .pipe(map(res => res?.data ?? res));
  }

  getAllLeaveBalances(): Observable<LeaveBalanceDTO[]> {
    return this.http.get<{ message: string, data: LeaveBalanceDTO[] }>(`${this.apiUrl}/GetAllLeaveBalances`)
      .pipe(map(res => res.data));
  }

  getLeaveBalanceById(id: number): Observable<LeaveBalanceDTO> {
    return this.http.get<{ message: string, data: LeaveBalanceDTO }>(`${this.apiUrl}/GetLeaveBalanceById/${id}`)
      .pipe(map(res => res.data));
  }

  updateLeaveBalance(id: number, updateDto: UpdateLeaveBalanceDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateLeaveBalance/${id}`, updateDto)
      .pipe(map(res => res?.data ?? res));
  }

  deleteLeaveBalance(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteLeaveBalance/${id}`)
      .pipe(map(res => res?.message ?? res));
  }

  GetMyLeaveBalance(): Observable<LeaveBalanceDTO[]> {
    return this.http.get<{ message: string, data: LeaveBalanceDTO[] }>(`${this.apiUrl}/GetMyLeaveBalance`)
      .pipe(map(res => res.data));
  }
}
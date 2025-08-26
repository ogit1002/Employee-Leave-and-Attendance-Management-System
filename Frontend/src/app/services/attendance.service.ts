import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface AttendanceDTO {
  employeeId: number;
  clockInTime: string;  // ISO string
  clockOutTime: string; // ISO string
}

export interface UpdateAttendanceDTO {
  clockInTime: string;
  clockOutTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly apiUrl = 'https://localhost:7165/api/Attendance';

  constructor(private http: HttpClient) {}  

  addAttendance(attendance: AttendanceDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddAttendance`, attendance).pipe(
      map(res => res?.data ?? res)
    );
  }

  getAllAttendance(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/GetAllAttendance`).pipe(
      map(res => res?.data ?? res)
    );
  }

  getAttendanceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetAttendanceById/${id}`).pipe(
      map(res => res?.data ?? res)
    );
  }

  updateAttendance(id: number, updateDto: UpdateAttendanceDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateAttendance/${id}`, updateDto).pipe(
      map(res => res?.data ?? res)
    );
  }

  deleteAttendanceById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteAttendanceById/${id}`).pipe(
      map(res => res?.message ?? res)
    );
  }

  getMyAttendance(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/GetMyAttendance`).pipe(
      map(res => res?.data ?? res)
    );
  }
}
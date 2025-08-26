import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface AttendanceReportDTO {
  reportID?: number; // Optional for form entry, returned by backend
  employeeID: number;
  dateRange: number;
  totalAttendance: number;
  absenteeism: number;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceReportService {
  private readonly apiUrl = 'https://localhost:7165/api/AttendanceReport';

  constructor(private http: HttpClient) {}

  addAttendanceReport(report: AttendanceReportDTO): Observable<any> {
    // Unwrap { message, data }
    return this.http.post<any>(`${this.apiUrl}/AddAttendanceReport`, report).pipe(
      map(res => res?.data ?? res)
    );
  }

  getAllAttendanceReport(): Observable<AttendanceReportDTO[]> {
    return this.http.get<any>(`${this.apiUrl}/GetAllAttendanceReport`).pipe(
      map(res => res?.data ?? res)
    );
  }

  getAttendanceReportById(id: number): Observable<AttendanceReportDTO> {
    return this.http.get<any>(`${this.apiUrl}/GetAttendanceReportById/${id}`).pipe(
      map(res => res?.data ?? res)
    );
  }

  updateAttendanceReport(id: number, report: AttendanceReportDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateAttendanceReport/${id}`, report).pipe(
      map(res => res?.data ?? res)
    );
  }

  deleteAttendanceReport(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteAttendanceReport/${id}`).pipe(
      map(res => res?.message ?? res)
    );
  }
}
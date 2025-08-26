import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ShiftDTO {
  ShiftId?: number;
  EmployeeId: number;
  ShiftDate: string;
  ShiftTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {
  private readonly apiUrl = 'https://localhost:7165/api/Shift';

  constructor(private http: HttpClient) {}

  addShift(shift: { EmployeeId: number; ShiftDate: string; ShiftTime: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddShift`, shift).pipe(
      map(res => ({
        ShiftId: res?.data?.shiftID ?? res?.data?.ShiftId ?? res?.data?.id,
        EmployeeId: res?.data?.employeeID ?? res?.data?.EmployeeId,
        ShiftDate: res?.data?.shiftDate ?? res?.data?.ShiftDate,
        ShiftTime: res?.data?.shiftTime ?? res?.data?.ShiftTime
      }))
    );
  }

  getAllShifts(): Observable<ShiftDTO[]> {
    return this.http.get<any>(`${this.apiUrl}/GetAllShift`).pipe(
      map(res =>
        (res?.data ?? []).map((shift: any) => ({
          ShiftId: shift.shiftID ?? shift.ShiftId ?? shift.id,
          EmployeeId: shift.employeeID ?? shift.EmployeeId,
          ShiftDate: shift.shiftDate ?? shift.ShiftDate,
          ShiftTime: shift.shiftTime ?? shift.ShiftTime
        }))
      )
    );
  }

  getMyShifts(): Observable<ShiftDTO[]> {
    return this.http.get<any>(`${this.apiUrl}/GetMyShifts`).pipe(
      map(res =>
        (res?.data ?? []).map((shift: any) => ({
          ShiftId: shift.shiftID ?? shift.ShiftId ?? shift.id,
          EmployeeId: shift.employeeID ?? shift.EmployeeId,
          ShiftDate: shift.shiftDate ?? shift.ShiftDate,
          ShiftTime: shift.shiftTime ?? shift.ShiftTime
        }))
      )
    );
  }

  updateShift(id: number, update: { ShiftDate: string; ShiftTime: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateShift/${id}`, update).pipe(
      map(res => ({
        ShiftId: res?.data?.shiftID ?? res?.data?.ShiftId ?? res?.data?.id,
        EmployeeId: res?.data?.employeeID ?? res?.data?.EmployeeId,
        ShiftDate: res?.data?.shiftDate ?? res?.data?.ShiftDate,
        ShiftTime: res?.data?.shiftTime ?? res?.data?.ShiftTime
      }))
    );
  }

  deleteShift(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteShift/${id}`).pipe(
      map(res => res?.message ?? res)
    );
  }

  getShiftsForEmployee(employeeId: number): Observable<ShiftDTO[]> {
    return this.http.get<any>(`${this.apiUrl}/GetShiftsForEmployee/${employeeId}`).pipe(
      map(res =>
        (res?.data ?? []).map((shift: any) => ({
          ShiftId: shift.shiftID ?? shift.ShiftId ?? shift.id,
          EmployeeId: shift.employeeID ?? shift.EmployeeId,
          ShiftDate: shift.shiftDate ?? shift.ShiftDate,
          ShiftTime: shift.shiftTime ?? shift.ShiftTime
        }))
      )
    );
  }

  // New: Fetch a single shift by its ID
  getShiftById(shiftId: number): Observable<ShiftDTO | null> {
    return this.http.get<any>(`${this.apiUrl}/GetShiftById/${shiftId}`).pipe(
      map(res => {
        const shift = res?.data;
        if (!shift) return null;
        return {
          ShiftId: shift.shiftID ?? shift.ShiftId ?? shift.id,
          EmployeeId: shift.employeeID ?? shift.EmployeeId,
          ShiftDate: shift.shiftDate ?? shift.ShiftDate,
          ShiftTime: shift.shiftTime ?? shift.ShiftTime
        };
      })
    );
  }
}
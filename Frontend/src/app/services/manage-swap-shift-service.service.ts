import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface SwapShiftRequestDTO {
  fromShiftID: number;
  reason: string;
}

export interface UpdateSwapShiftRequestDTO {
  fromShiftID: number;
  reason: string;
  status: string;
}

export interface SwapShiftRequest {
  swapShiftRequestID: number;
  requestingEmployeeID: number;
  fromShiftID: number;
  reason: string;
  status: string;
  requestedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ManageSwapShiftService {
  private apiUrl = 'https://localhost:7165/api/ManageShifts';

  constructor(private http: HttpClient) {}

  addSwapShiftRequest(request: SwapShiftRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddSwapShiftRequest`, request).pipe(
      map(res => res?.data ?? res)
    );
  }

  getAllSwapShiftRequests(): Observable<SwapShiftRequest[]> {
    return this.http.get<any>(`${this.apiUrl}/GetAllswapshiftrequests`).pipe(
      map(res => res?.data ?? res)
    );
  }

  getSwapShiftsRequestForEmployee(employeeId: number): Observable<SwapShiftRequest[]> {
    return this.http.get<any>(`${this.apiUrl}/GetSwapShiftsRequestForEmployee/${employeeId}`).pipe(
      map(res => res?.data ?? res)
    );
  }

  getMySwapShiftRequests(): Observable<SwapShiftRequest[]> {
    return this.http.get<any>(`${this.apiUrl}/GetMySwapShiftRequests`).pipe(
      map(res => res?.data ?? res)
    );
  }

  updateSwapShiftRequest(id: number, request: UpdateSwapShiftRequestDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateSwapshiftRequest/${id}`, request).pipe(
      map(res => res?.data ?? res)
    );
  }

  deleteSwapShiftRequest(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteSwapShiftRequest/${id}`).pipe(
      map(res => res?.message ?? res)
    );
  }
}
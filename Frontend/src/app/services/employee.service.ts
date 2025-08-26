import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  email: string;
  address: string;
}

export interface EmployeeRegisterDTO {
  name: string;
  email: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7165/api/Employee';

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<any>(`${this.apiUrl}/GetAllEmployees`).pipe(
      map(res => res?.data ?? res)
    );
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<any>(`${this.apiUrl}/GetEmployeeById/${id}`).pipe(
      map(res => res?.data ?? res)
    );
  }

  addEmployee(employee: EmployeeRegisterDTO): Observable<any> {
    // Return raw response to include password and message
    return this.http.post<any>(`${this.apiUrl}/AddEmployee`, employee);
  }

  updateEmployee(id: number, employee: EmployeeRegisterDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateEmployee/${id}`, employee).pipe(
      map(res => res?.data ?? res)
    );
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteEmployee/${id}`).pipe(
      map(res => res?.message ?? res)
    );
  }
}
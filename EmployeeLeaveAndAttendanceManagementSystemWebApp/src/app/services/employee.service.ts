import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee{
  name : string;
  email : string;
  address : string;
}

export interface EmployeeResponse{
  id : string;
  name : string;
  email : string;
  address : string;
}

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  
  private baseUrl = 'https://localhost:7165';

  constructor(private http : HttpClient){}
  token = JSON.parse(localStorage.getItem("currentUser") || '{}')?.token;

  addEmployee(employee : Employee) : Observable<any>{
    console.log("the token :   "+this.token);
    const headers = new HttpHeaders(
      {
        Authorization : `Bearer ${this.token}`
      }
    );
  
    return this.http.post(`${this.baseUrl}/api/Employee/AddEmployee`,employee,{headers});
  }

  getEmployeeList() : Observable<any>{
    console.log("the token :   "+this.token);
    const headers = new HttpHeaders(
      {
        Authorization : `Bearer ${this.token}`
      }
    );
  
    return this.http.get(`${this.baseUrl}/api/Employee/GetAllEmployees`,{headers});
  }

  getEmployeeById(id : number) : Observable<any>{
    console.log("the token :   "+this.token);
    const headers = new HttpHeaders(
      {
        Authorization : `Bearer ${this.token}`
      }
    );
  
    return this.http.get(`${this.baseUrl}/api/Employee/GetEmployeeById/${id}`,{headers});
  }
}

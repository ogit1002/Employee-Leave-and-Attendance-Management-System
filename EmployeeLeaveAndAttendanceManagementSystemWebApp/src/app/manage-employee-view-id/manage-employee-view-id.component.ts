import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService, EmployeeResponse } from '../services/employee.service';

@Component({
  selector: 'app-manage-employee-view-id',
  templateUrl: './manage-employee-view-id.component.html',
  styleUrls: ['./manage-employee-view-id.component.css']
})
export class ManageEmployeeViewIdComponent {

  isLoading : boolean = false;
  errorMessage : string = "";

  employee: EmployeeResponse = {
    id: "",
    name: "",
    email: "",
    address: ""
  };

  viewEmployeeForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.viewEmployeeForm = this.formBuilder.group({
      EmployeeId: ['', Validators.required],
    })
  }

  onSubmit(): void {
    if(this.viewEmployeeForm.invalid) {
      console.log("Invalid");
      return;
    }
    this.isLoading = true;
    this.errorMessage = "";

    this.employeeService.getEmployeeById(this.viewEmployeeForm.value.EmployeeId).subscribe(
      {
        next: (response) => {
          this.employee = response;
          console.log("Employee fetched successfully !\nHere's the object : " + JSON.stringify(this.employee));
        },
        error: (error) => {
          console.log(error);
          this.errorMessage = error.error;
          this.employee.name = "";
          this.viewEmployeeForm.reset();
        },
        complete: () => {
          this.isLoading = false;
          this.viewEmployeeForm.reset();
        }
      }
    )
  }
}

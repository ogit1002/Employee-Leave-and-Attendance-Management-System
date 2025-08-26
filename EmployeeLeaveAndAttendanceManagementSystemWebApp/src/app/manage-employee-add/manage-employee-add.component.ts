import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manage-employee-add',
  templateUrl: './manage-employee-add.component.html',
  styleUrls: ['./manage-employee-add.component.css']
})
export class ManageEmployeeAddComponent {

  isLoading = false;

  addEmployeeForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private EmployeeService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
    this.addEmployeeForm = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Address: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.addEmployeeForm.invalid) {
      console.log("Invalid");
      return;
    }
    this.isLoading = true;

    this.EmployeeService.addEmployee(this.addEmployeeForm.value).subscribe(
      {
        next: (response) => {
          alert("Employee added successfully !\nHere's the object : " + JSON.stringify(response));
          // this.router.navigate(["/manage-employee"]);
        },
        error: (error) => {
          console.log("Error occured! ");
          console.log(error);
          this.addEmployeeForm.reset();
          alert("Something went Wrong!");
        },
        complete: () => {
          this.isLoading = false;
          this.addEmployeeForm.reset();
        }
      }
    )
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})
export class ManageEmployeeComponent {

  currentForm : string = '';
  showForm(form : string) : void{
    this.currentForm = form;
  }
  
}

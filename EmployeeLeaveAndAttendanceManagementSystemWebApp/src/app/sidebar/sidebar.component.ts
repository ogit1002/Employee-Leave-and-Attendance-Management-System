import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OnInit } from '@angular/core';
import { LoginResponse } from '../services/auth.service';
import { ManageEmployeeComponent } from '../manage-employee/manage-employee.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  isLoggedIn = false;

  constructor(private authService: AuthService){
    
  }

  userInfo : LoginResponse | null = null; //for getting username


  ngOnInit ():void{
    this.authService.currentUser$.subscribe(user=>{
      this.isLoggedIn=!!user;
      this.userInfo=this.authService.currentUserValue; //for getiing user name
    });
  }//is logged in logic done


  
  

}

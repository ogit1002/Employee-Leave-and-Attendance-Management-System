import { Component, OnInit } from '@angular/core';
import { LeaveRequestService, LeaveRequestDTO } from 'src/app/services/leave-request.service';

@Component({
  selector: 'app-view-leave-request',
  templateUrl: './view-leave-request.component.html',
  styleUrls: ['./view-leave-request.component.css']
})
export class ViewLeaveRequestComponent implements OnInit {
  myLeaveRequests: LeaveRequestDTO[] = [];
  error: string = '';

  constructor(private leaveRequestService: LeaveRequestService) {}

  ngOnInit(): void {
    this.leaveRequestService.getMyLeaveRequests().subscribe({
      next: (data: LeaveRequestDTO[]) => this.myLeaveRequests = data,
      error: () => this.error = 'Failed to load your leave requests'
    });
  }
}
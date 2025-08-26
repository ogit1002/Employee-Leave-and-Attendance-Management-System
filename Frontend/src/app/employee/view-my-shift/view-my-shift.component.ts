import { Component, OnInit } from '@angular/core';
import { ShiftsService, ShiftDTO } from '../../services/shifts.service';

@Component({
  selector: 'app-view-my-shift',
  templateUrl: './view-my-shift.component.html',
  styleUrls: ['./view-my-shift.component.css']
})
export class ViewMyShiftComponent implements OnInit {
  myShifts: ShiftDTO[] = [];
  loading = false;
  error = '';

  constructor(private shiftsService: ShiftsService) {}

  ngOnInit() {
    this.fetchMyShifts();
  }

  fetchMyShifts() {
    this.loading = true;
    this.error = '';
    this.shiftsService.getMyShifts().subscribe({
      next: (shifts) => {
        this.myShifts = shifts;
        this.loading = false;
      },
      error: (err) => {
        // Safely extract a human-readable error message
        if (typeof err.error === 'string') {
          this.error = err.error;
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else if (err.message) {
          this.error = err.message;
        } else {
          this.error = 'Failed to fetch shifts.';
        }
        this.loading = false;
      }
    });
  }

  // Optional: Utility to format date/time for display
  formatDate(dateStr: string) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString();
    } catch {
      return dateStr;
    }
  }
  formatTime(timeStr: string) {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  }
}
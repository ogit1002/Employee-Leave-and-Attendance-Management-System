import { Component, OnInit } from '@angular/core';
import { ShiftsService, ShiftDTO } from '../../services/shifts.service';

@Component({
  selector: 'app-shift-management',
  templateUrl: './shift-management.component.html',
  styleUrls: ['./shift-management.component.css']
})
export class ShiftManagementComponent implements OnInit {
  shifts: ShiftDTO[] = [];
  newShift: ShiftDTO = { EmployeeId: 0, ShiftDate: '', ShiftTime: '' };
  updateShiftData: ShiftDTO = { EmployeeId: 0, ShiftDate: '', ShiftTime: '' };
  fetchShiftId: number | null = null;
  selectedShift: ShiftDTO | null = null;

  showSuccessModal = false;
  showErrorModal = false;
  successMessage = '';
  errorMessage = '';

  constructor(private shiftsService: ShiftsService) {}

  ngOnInit(): void {
    this.loadShifts();
  }

  loadShifts(): void {
    this.shiftsService.getAllShifts().subscribe({
      next: (data) => {
        this.shifts = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load shifts!';
        this.showErrorModal = true;
      }
    });
  }

  
  addShift(): void {
    this.shiftsService.addShift(this.newShift).subscribe({
      next: () => {
        this.successMessage = 'Shift added successfully!';
        this.showSuccessModal = true;
        this.loadShifts();
        this.newShift = { EmployeeId: 0, ShiftDate: '', ShiftTime: '' }; // Reset form
      },
      error: () => {
        this.errorMessage = 'Failed to add shift!';
        this.showErrorModal = true;
      }
    });
  }

  prepareUpdate(shift: ShiftDTO): void {
    this.selectedShift = shift;
    this.updateShiftData = { ...shift }; // Clone the shift data for editing
  }

  updateShift(): void {
    if (this.selectedShift) {
      this.shiftsService.updateShift(this.selectedShift.ShiftId!, this.updateShiftData).subscribe({
        next: () => {
          this.successMessage = 'Shift updated successfully!';
          this.showSuccessModal = true;
          this.loadShifts();
          this.selectedShift = null; // Reset selection
        },
        error: () => {
          this.errorMessage = 'Failed to update shift!';
          this.showErrorModal = true;
        }
      });
    }
  }

  cancelUpdate(): void {
    this.selectedShift = null; // Cancel editing
    this.updateShiftData = { EmployeeId: 0, ShiftDate: '', ShiftTime: '' }; // Reset update data
  }

  deleteShift(shiftId: number): void {
    this.shiftsService.deleteShift(shiftId).subscribe({
      next: () => {
        this.successMessage = 'Shift deleted successfully!';
        this.showSuccessModal = true;
        this.loadShifts();
      },
      error: () => {
        this.errorMessage = 'Failed to delete shift!';
        this.showErrorModal = true;
      }
    });
  }

  fetchedShift: ShiftDTO | null = null; // Add this property to store fetched shift details

fetchShiftById(): void {
  if (this.fetchShiftId !== null) {
    console.log('Fetching shift with ID:', this.fetchShiftId); // Debugging
    this.shiftsService.getShiftById(this.fetchShiftId).subscribe({
      next: (data) => {
        if (data) {
          this.fetchedShift = data; // Store the fetched shift details
          this.successMessage = `Shift fetched successfully!`;
          this.showSuccessModal = true;
        } else {
          this.fetchedShift = null; // Clear previous data if no shift is found
          this.errorMessage = 'No shift found with the provided ID!';
          this.showErrorModal = true;
        }
      },
      error: (err) => {
        console.error('Error fetching shift:', err); // Debugging
        this.fetchedShift = null; // Clear previous data on error
        this.errorMessage = 'Failed to fetch shift!';
        this.showErrorModal = true;
      }
    });
  } else {
    this.errorMessage = 'Please enter a valid Shift ID!';
    this.showErrorModal = true;
  }
}
  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }
}
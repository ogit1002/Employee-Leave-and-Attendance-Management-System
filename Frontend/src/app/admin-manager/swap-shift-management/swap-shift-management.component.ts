import { Component, OnInit } from '@angular/core';
import { ManageSwapShiftService, SwapShiftRequest, SwapShiftRequestDTO, UpdateSwapShiftRequestDTO } from '../../services/manage-swap-shift-service.service';

@Component({
  selector: 'app-swap-shift-management',
  templateUrl: './swap-shift-management.component.html',
  styleUrls: ['./swap-shift-management.component.css']
})
export class SwapShiftManagementComponent implements OnInit {
  swapShiftRequests: SwapShiftRequest[] = [];
  mySwapShiftRequests: SwapShiftRequest[] = [];
  newSwapRequest: SwapShiftRequestDTO = { fromShiftID: 0, reason: '' };
  updateRequest: UpdateSwapShiftRequestDTO = { fromShiftID: 0, reason: '', status: '' };
  isAdmin = false;
  isManager = false;
  isEmployee = false;

  // Error and Success Handling
  errorMessage = '';
  successMessage = '';
  showSuccessModal = false;
  showErrorModal = false;

  selectedRequestId: number | null = null;
  statusOptions = ['Approved', 'Pending', 'Rejected'];

  constructor(private swapShiftService: ManageSwapShiftService) {}

  ngOnInit() {
    // Set your role flags here based on your authentication logic.
    this.isAdmin = true; // Example: Replace with real authentication logic.

    this.fetchAllSwapRequests();
    this.fetchMySwapRequests();
  }

  fetchAllSwapRequests() {
    this.swapShiftService.getAllSwapShiftRequests().subscribe({
      next: (data) => {
        this.swapShiftRequests = data ?? [];
      },
      error: () => {
        console.error('Failed to load swap shift requests.'); // Log the error instead of showing a modal
      }
    });
  }

  fetchMySwapRequests() {
    this.swapShiftService.getMySwapShiftRequests().subscribe({
      next: (data) => {
        this.mySwapShiftRequests = data ?? [];
      },
      error: () => {
        console.error('Failed to load your swap shift requests.'); // Log the error instead of showing a modal
      }
    });
  }

  submitSwapShiftRequest() {
    this.errorMessage = '';
    this.successMessage = '';
    this.swapShiftService.addSwapShiftRequest(this.newSwapRequest).subscribe({
      next: () => {
        this.successMessage = 'Swap shift request added successfully!';
        this.showSuccessModal = true;
        this.fetchAllSwapRequests();
        this.fetchMySwapRequests();
        this.newSwapRequest = { fromShiftID: 0, reason: '' }; // Reset form
      },
      error: () => {
        this.errorMessage = 'Failed to add swap shift request.';
        this.showErrorModal = true;
      }
    });
  }

  startUpdate(request: SwapShiftRequest) {
    this.selectedRequestId = request.swapShiftRequestID;
    this.updateRequest = {
      fromShiftID: request.fromShiftID,
      reason: request.reason,
      status: request.status
    };
  }

  submitUpdate() {
    if (this.selectedRequestId !== null) {
      this.swapShiftService.updateSwapShiftRequest(this.selectedRequestId, this.updateRequest).subscribe({
        next: () => {
          this.successMessage = 'Swap shift request updated successfully!';
          this.showSuccessModal = true;
          this.fetchAllSwapRequests();
          this.fetchMySwapRequests();
          this.selectedRequestId = null;
        },
        error: () => {
          this.errorMessage = 'Failed to update swap shift request.';
          this.showErrorModal = true;
        }
      });
    }
  }

  deleteRequest(id: number) {
    if (!confirm('Are you sure?')) return;
    this.swapShiftService.deleteSwapShiftRequest(id).subscribe({
      next: () => {
        this.successMessage = 'Swap shift request deleted successfully!';
        this.showSuccessModal = true;
        this.fetchAllSwapRequests();
        this.fetchMySwapRequests();
      },
      error: () => {
        this.errorMessage = 'Failed to delete swap shift request.';
        this.showErrorModal = true;
      }
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }
}
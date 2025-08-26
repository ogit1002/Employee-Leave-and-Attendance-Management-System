import { Component } from '@angular/core';
import { ManageSwapShiftService, SwapShiftRequestDTO } from '../../services/manage-swap-shift-service.service';

@Component({
  selector: 'app-req-swap-shift',
  templateUrl: './req-swap-shift.component.html',
  styleUrls: ['./req-swap-shift.component.css']
})
export class ReqSwapShiftComponent {
  fromShiftID: number | null = null;
  reason: string = '';    
  loading = false;
  success = '';
  error = '';

  constructor(private swapShiftService: ManageSwapShiftService) {}

  onSubmit() {
    this.success = '';
    this.error = '';
    this.loading = true;

    if (!this.fromShiftID || !this.reason.trim()) {
      this.error = 'All fields are required.';
      this.loading = false;
      return;
    }

    const request: SwapShiftRequestDTO = {
      fromShiftID: this.fromShiftID,
      reason: this.reason.trim()
    };

    this.swapShiftService.addSwapShiftRequest(request).subscribe({
      next: (res) => {
        this.success = res?.message || 'Swap shift request submitted successfully.';
        this.fromShiftID = null;
        this.reason = '';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.title || err.error?.message || err.error || 'Failed to submit swap shift request.';
        this.loading = false;
      }
    });
  }
}
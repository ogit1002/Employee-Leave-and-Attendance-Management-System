import { Component, OnInit } from '@angular/core';
import { ManageSwapShiftService, SwapShiftRequest } from '../../services/manage-swap-shift-service.service';

@Component({
  selector: 'app-view-swap-shift-req',
  templateUrl: './view-swap-shift-req.component.html',
  styleUrls: ['./view-swap-shift-req.component.css']
})
export class ViewSwapShiftReqComponent implements OnInit {
  mySwapShiftRequests: SwapShiftRequest[] = [];
  loading = false;
  error = '';

  constructor(private swapShiftService: ManageSwapShiftService) {}

  ngOnInit() {
    this.fetchMySwapShiftRequests();
  }

  fetchMySwapShiftRequests() {
    this.loading = true;
    this.error = '';
    this.swapShiftService.getMySwapShiftRequests().subscribe({
      next: (reqs) => {
        this.mySwapShiftRequests = reqs;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.title || err.error || 'Failed to load your swap shift requests.';
        this.loading = false;
      }
    });
  }

  formatDateTime(dt: string) {
    return new Date(dt).toLocaleString();
  }
}
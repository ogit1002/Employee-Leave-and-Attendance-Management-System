import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveBalanceManagementComponent } from './leave-balance-management.component';

describe('LeaveBalanceManagementComponent', () => {
  let component: LeaveBalanceManagementComponent;
  let fixture: ComponentFixture<LeaveBalanceManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveBalanceManagementComponent]
    });
    fixture = TestBed.createComponent(LeaveBalanceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapShiftManagementComponent } from './swap-shift-management.component';

describe('SwapShiftManagementComponent', () => {
  let component: SwapShiftManagementComponent;
  let fixture: ComponentFixture<SwapShiftManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwapShiftManagementComponent]
    });
    fixture = TestBed.createComponent(SwapShiftManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

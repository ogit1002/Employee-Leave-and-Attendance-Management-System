import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqSwapShiftComponent } from './req-swap-shift.component';

describe('ReqSwapShiftComponent', () => {
  let component: ReqSwapShiftComponent;
  let fixture: ComponentFixture<ReqSwapShiftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReqSwapShiftComponent]
    });
    fixture = TestBed.createComponent(ReqSwapShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

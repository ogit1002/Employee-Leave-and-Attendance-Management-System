import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSwapShiftReqComponent } from './view-swap-shift-req.component';

describe('ViewSwapShiftReqComponent', () => {
  let component: ViewSwapShiftReqComponent;
  let fixture: ComponentFixture<ViewSwapShiftReqComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSwapShiftReqComponent]
    });
    fixture = TestBed.createComponent(ViewSwapShiftReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqResetPasswordComponent } from './req-reset-password.component';

describe('ReqResetPasswordComponent', () => {
  let component: ReqResetPasswordComponent;
  let fixture: ComponentFixture<ReqResetPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReqResetPasswordComponent]
    });
    fixture = TestBed.createComponent(ReqResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

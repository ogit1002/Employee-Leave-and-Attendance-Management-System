import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmployeeViewIdComponent } from './manage-employee-view-id.component';

describe('ManageEmployeeViewIdComponent', () => {
  let component: ManageEmployeeViewIdComponent;
  let fixture: ComponentFixture<ManageEmployeeViewIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageEmployeeViewIdComponent]
    });
    fixture = TestBed.createComponent(ManageEmployeeViewIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmployeeUpdateComponent } from './manage-employee-update.component';

describe('ManageEmployeeUpdateComponent', () => {
  let component: ManageEmployeeUpdateComponent;
  let fixture: ComponentFixture<ManageEmployeeUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageEmployeeUpdateComponent]
    });
    fixture = TestBed.createComponent(ManageEmployeeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

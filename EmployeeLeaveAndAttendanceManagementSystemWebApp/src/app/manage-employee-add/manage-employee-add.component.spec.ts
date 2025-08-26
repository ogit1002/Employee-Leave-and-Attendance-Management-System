import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmployeeAddComponent } from './manage-employee-add.component';

describe('ManageEmployeeAddComponent', () => {
  let component: ManageEmployeeAddComponent;
  let fixture: ComponentFixture<ManageEmployeeAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageEmployeeAddComponent]
    });
    fixture = TestBed.createComponent(ManageEmployeeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRegisterComponent } from './attendance-register.component';

describe('AttendanceRegisterComponent', () => {
  let component: AttendanceRegisterComponent;
  let fixture: ComponentFixture<AttendanceRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceRegisterComponent]
    });
    fixture = TestBed.createComponent(AttendanceRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

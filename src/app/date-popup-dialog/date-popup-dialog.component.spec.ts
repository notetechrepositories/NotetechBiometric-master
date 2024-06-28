import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePopupDialogComponent } from './date-popup-dialog.component';

describe('DatePopupDialogComponent', () => {
  let component: DatePopupDialogComponent;
  let fixture: ComponentFixture<DatePopupDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatePopupDialogComponent]
    });
    fixture = TestBed.createComponent(DatePopupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

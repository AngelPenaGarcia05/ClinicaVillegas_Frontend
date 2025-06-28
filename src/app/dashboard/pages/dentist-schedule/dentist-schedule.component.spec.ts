import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentistScheduleComponent } from './dentist-schedule.component';

describe('DentistScheduleComponent', () => {
  let component: DentistScheduleComponent;
  let fixture: ComponentFixture<DentistScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentistScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DentistScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicReportComponent } from './dynamic-report.component';

describe('DynamicReportComponent', () => {
  let component: DynamicReportComponent;
  let fixture: ComponentFixture<DynamicReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

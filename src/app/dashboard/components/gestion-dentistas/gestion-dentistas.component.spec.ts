import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDentistasComponent } from './gestion-dentistas.component';

describe('GestionDentistasComponent', () => {
  let component: GestionDentistasComponent;
  let fixture: ComponentFixture<GestionDentistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionDentistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDentistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

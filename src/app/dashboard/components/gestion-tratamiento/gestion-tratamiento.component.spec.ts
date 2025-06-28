import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTratamientoComponent } from './gestion-tratamiento.component';

describe('GestionTratamientoComponent', () => {
  let component: GestionTratamientoComponent;
  let fixture: ComponentFixture<GestionTratamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTratamientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionTratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

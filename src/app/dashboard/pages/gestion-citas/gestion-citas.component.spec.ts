import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCitasComponent } from './gestion-citas.component';

describe('GestionCitasComponent', () => {
  let component: GestionCitasComponent;
  let fixture: ComponentFixture<GestionCitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCitasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

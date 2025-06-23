import { TestBed } from '@angular/core/testing';

import { HorarioService } from './horario.service';

describe('HorarioService', () => {
  let service: HorarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

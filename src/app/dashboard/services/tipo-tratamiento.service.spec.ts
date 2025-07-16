import { TestBed } from '@angular/core/testing';

import { TipoTratamientoService } from './tipo-tratamiento.service';

describe('TipoTratamientoService', () => {
  let service: TipoTratamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoTratamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

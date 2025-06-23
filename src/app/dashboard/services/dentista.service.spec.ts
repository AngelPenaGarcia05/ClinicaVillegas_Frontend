import { TestBed } from '@angular/core/testing';

import { DentistaService } from './dentista.service';

describe('DentistaService', () => {
  let service: DentistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DentistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { Unidades.CentroService } from './unidades.centro.service';

describe('Unidades.CentroService', () => {
  let service: Unidades.CentroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Unidades.CentroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

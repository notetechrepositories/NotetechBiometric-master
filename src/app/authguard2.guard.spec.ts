import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authguard2Guard } from './authguard2.guard';

describe('authguard2Guard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authguard2Guard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

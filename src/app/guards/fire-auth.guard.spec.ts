import { TestBed } from '@angular/core/testing';

import { FireAuthGuard } from './fire-auth.guard';

describe('FireAuthGuard', () => {
  let guard: FireAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FireAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

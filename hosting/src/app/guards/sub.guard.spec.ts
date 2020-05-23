import { TestBed } from '@angular/core/testing';

import { SubGuard } from './sub.guard';

describe('SubGuard', () => {
  let guard: SubGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SubGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { BaseEffects } from './base.effects';

describe('BaseEffects', () => {
  let actions$: Observable<any>;
  let effects: BaseEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BaseEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(BaseEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

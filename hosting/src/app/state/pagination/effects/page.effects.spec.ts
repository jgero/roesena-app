import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { PageEffects } from './page.effects';

describe('PageEffects', () => {
  let actions$: Observable<any>;
  let effects: PageEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PageEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(PageEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

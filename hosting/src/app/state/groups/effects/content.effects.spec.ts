import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ContentEffects } from './content.effects';

describe('ContentEffects', () => {
  let actions$: Observable<any>;
  let effects: ContentEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContentEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(ContentEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

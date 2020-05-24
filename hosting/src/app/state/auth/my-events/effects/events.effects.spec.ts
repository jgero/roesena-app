import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { EventsEffects } from './events.effects';

describe('EventsEffects', () => {
  let actions$: Observable<any>;
  let effects: EventsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(EventsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ImageEffects } from './image.effects';

describe('ImageEffects', () => {
  let actions$: Observable<any>;
  let effects: ImageEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImageEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(ImageEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

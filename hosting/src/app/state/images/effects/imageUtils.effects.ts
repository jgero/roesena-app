import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, withLatestFrom, tap } from 'rxjs/operators';
import { ImageActionTypes, ImageActions } from '../actions/image.actions';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import undefined from 'firebase/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { UrlLoaderService } from '@services/url-loader.service';

@Injectable()
export class ImageUtilsEffects {
  @Effect({ dispatch: false })
  copyUrlToClipboard$ = this.actions$.pipe(
    ofType(ImageActionTypes.CopyUrlToClipboard),
    withLatestFrom(this.store),
    switchMap(([action, storeState]) => this.urlLoader.getImageURL(storeState.images.activeImage.id, false)),
    tap((url) => {
      this.clipboard.copy(url);
      this.snackbar.open('Bild-URL wurde in die Zwischenablage kopiert', 'OK');
    })
  );

  constructor(
    private actions$: Actions<ImageActions>,
    private store: Store<State>,
    private snackbar: MatSnackBar,
    private urlLoader: UrlLoaderService,
    private clipboard: Clipboard
  ) {}
}

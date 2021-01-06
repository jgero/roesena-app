import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Subscription, of, EMPTY } from 'rxjs';
import { tap, map, takeUntil, switchMap } from 'rxjs/operators';

import { AppImage } from 'src/app/utils/interfaces';
import { ChipsInputService } from 'src/app/services/chips-input.service';
import { Store } from '@ngrx/store';
import { State } from '@state/images/editor/reducers/image.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { LoadImage } from '@state/images/actions/image.actions';
import { UpdateImage, CreateImage, DeleteImage } from '@state/images/editor/actions/image.actions';
import { UrlLoaderService } from '@services/url-loader.service';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { DeleteConfirmPopupComponent } from '@shared/delete-confirm/delete-confirm-popup/delete-confirm-popup.component';
import { CookieService } from 'ngx-cookie-service';
import { UsageHintPopupComponent } from '@shared/usage-hints/usage-hint-popup/usage-hint-popup.component';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnDestroy {
  isLoading$ = this.store.select('imageEditor', 'isLoading');
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  imageForm: FormGroup;
  image: AppImage;
  url: string;
  get canSave(): boolean {
    if (!this.imageForm) {
      return false;
    }
    // user can save if everything is valid and something actually changed
    return this.imageForm.valid && this.imageForm.dirty;
  }

  constructor(
    public chips: ChipsInputService,
    private store: Store<State>,
    private subs: SubscriptionService,
    private urlLoader: UrlLoaderService,
    private dialog: MatDialog,
    titleService: Title,
    private cookies: CookieService
  ) {
    titleService.setTitle('RöSeNa - Bild Editor');
    this.store.dispatch(new LoadImage());
    this.store
      .select('imageEditor', 'isLoading')
      .pipe(takeUntil(subs.unsubscribe$))
      .subscribe({
        next: (isLoading) => {
          if (!this.imageForm) {
            return;
          }
          if (isLoading) {
            this.imageForm.disable();
          } else {
            this.imageForm.enable();
          }
        },
      });
    this.store
      .select('image', 'image')
      .pipe(takeUntil(this.subs.unsubscribe$))
      .subscribe({
        next: (image) => {
          if (!image) {
            return;
          }
          // deep copy the image
          this.image = cloneDeep(image);
          this.imageForm = new FormGroup({
            tags: new FormControl(this.image.tags),
            image: new FormControl(''),
          });
        },
      });
    this.store
      .select('image', 'image')
      .pipe(
        takeUntil(this.subs.unsubscribe$),
        switchMap((image) => (image && image.id ? this.urlLoader.getImageURL(image.id) : EMPTY))
      )
      .subscribe({ next: (url) => (this.url = url) });
  }

  onSubmit() {
    // if cookie is set save directly, otherwise force user to accept
    if (this.cookies.check('UsageAgreementAccepted')) {
      this.saveImage();
    } else {
      this.dialog
        .open(UsageHintPopupComponent)
        .afterClosed()
        .pipe(takeUntil(this.subs.unsubscribe$))
        .subscribe((result) => {
          // only act if the user has accepted the usage hints
          if (result) {
            this.saveImage();
          }
        });
    }
  }

  saveImage() {
    const updated = this.image;
    updated.tags = this.imageForm.get('tags').value;
    updated.created = new Date();
    if (this.image.id) {
      this.store.dispatch(new UpdateImage({ image: updated, file: this.imageForm.get('image').value }));
    } else {
      this.store.dispatch(new CreateImage({ image: updated, file: this.imageForm.get('image').value }));
    }
  }

  onDelete() {
    this.dialog
      .open(DeleteConfirmPopupComponent, { data: { title: 'Sicher?' } })
      .afterClosed()
      .pipe(takeUntil(this.subs.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.store.dispatch(new DeleteImage());
        }
      });
  }

  onImageChange(file: File) {
    if (!file) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      this.imageForm.get('image').setValue(fr.result);
      this.imageForm.get('image').markAsDirty();
      this.url = fr.result as string;
    };
    fr.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}

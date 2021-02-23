import { ENTER, COMMA, TAB } from '@angular/cdk/keycodes';
import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil, filter } from 'rxjs/operators';
import { AppArticle } from 'src/app/utils/interfaces';
import { ChipsInputService } from 'src/app/services/chips-input.service';
import { Store } from '@ngrx/store';
import { LoadSingleArticle } from '@state/articles/actions/article.actions';
import { SubscriptionService } from '@services/subscription.service';
import { State } from '@state/articles/editor/reducers/editor.reducer';
import { UpdateArticle, CreateArticle, DeleteArticle } from '@state/articles/actions/article.actions';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';
import { DeleteConfirmPopupComponent } from '@shared/delete-confirm/delete-confirm-popup/delete-confirm-popup.component';
import { UsageHintPopupComponent } from '@shared/usage-hints/usage-hint-popup/usage-hint-popup.component';
import { CookieService } from 'ngx-cookie-service';
import { SeoService } from '@services/seo.service';
import { AutocompleteService } from '@services/autocomplete.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnDestroy {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  article: AppArticle;
  articleForm: FormGroup;
  isLoading$ = this.store.select('articleEditor', 'isLoading');
  get canSave(): boolean {
    if (!this.articleForm) {
      return false;
    }
    // user can save if everything is valid and something actually changed
    return this.articleForm.valid && this.articleForm.dirty;
  }

  constructor(
    private store: Store<State>,
    public chips: ChipsInputService,
    private subs: SubscriptionService,
    private dialog: MatDialog,
    seo: SeoService,
    private cookies: CookieService,
    public autocomplete: AutocompleteService
  ) {
    this.store.dispatch(new LoadSingleArticle({ withImage: false }));
    this.store
      .select('articleEditor', 'isLoading')
      .pipe(takeUntil(this.subs.unsubscribe$))
      .subscribe({
        next: (isLoading) => {
          if (!this.articleForm) {
            return;
          }
          if (isLoading) {
            this.articleForm.disable();
          } else {
            this.articleForm.enable();
          }
        },
      });
    this.store
      .select('article', 'activeArticle')
      .pipe(
        filter((article) => article !== null),
        takeUntil(this.subs.unsubscribe$)
      )
      .subscribe({
        next: (article) => {
          seo.setTags(`Bearbeiten: ${article.title}`, undefined, undefined, `/articles/edit/${article.id}`);
          this.article = cloneDeep(article);
          this.article.created = new Date(this.article.created);
          this.articleForm = new FormGroup({
            title: new FormControl(this.article.title, [Validators.required, Validators.maxLength(35)]),
            content: new FormControl(this.article.content, [Validators.required]),
            tags: new FormControl(this.article.tags),
          });
        },
      });
  }

  onSubmit() {
    // if cookie is set save directly, otherwise force user to accept
    if (this.cookies.check('UsageAgreementAccepted')) {
      this.saveArticle();
    } else {
      this.dialog
        .open(UsageHintPopupComponent)
        .afterClosed()
        .pipe(takeUntil(this.subs.unsubscribe$))
        .subscribe((result) => {
          // only act if the user has accepted the usage hints
          if (result) {
            this.saveArticle();
          }
        });
    }
  }

  private saveArticle() {
    const updated = this.article;
    updated.title = this.articleForm.get('title').value;
    updated.content = this.articleForm.get('content').value;
    updated.tags = this.articleForm.get('tags').value;
    if (this.article.id) {
      this.store.dispatch(new UpdateArticle({ article: updated }));
    } else {
      // on success navigate to the edit page of the article with the new id
      this.store.dispatch(new CreateArticle({ article: updated }));
    }
    this.articleForm.markAsPristine();
  }

  deleteArticle(): void {
    this.dialog
      .open(DeleteConfirmPopupComponent, { data: { title: 'Sicher?' } })
      .afterClosed()
      .pipe(takeUntil(this.subs.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.store.dispatch(new DeleteArticle({ article: this.article }));
        }
      });
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}

import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil, filter } from 'rxjs/operators';
import { AppArticle } from 'src/app/utils/interfaces';
import { ChipsInputService } from 'src/app/services/chips-input.service';
import { Store } from '@ngrx/store';
import { LoadSingleArticle } from '@state/articles/actions/article.actions';
import { SubscriptionService } from '@services/subscription.service';
import { State } from '@state/articles/editor/reducers/editor.reducer';
import { UpdateArticle, CreateArticle, DeleteArticle } from '@state/articles/editor/actions/editor.actions';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnDestroy {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
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
    titleService: Title
  ) {
    titleService.setTitle('RöSeNa - Artikel Editor');
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
      .select('article', 'article')
      .pipe(
        filter((article) => article !== null),
        takeUntil(this.subs.unsubscribe$)
      )
      .subscribe({
        next: (article) => {
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
      .open(DeleteDialogComponent)
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

@Component({
  selector: 'app-delete-dialog',
  templateUrl: 'delete-dialog.html',
})
export class DeleteDialogComponent {}

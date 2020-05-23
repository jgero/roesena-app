import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil, take, filter, tap } from 'rxjs/operators';
import { AppArticle } from 'src/app/utils/interfaces';
import { ChipsInputService } from 'src/app/services/chips-input.service';
import { Store } from '@ngrx/store';
import { LoadSingleArticle } from '@state/articles/actions/article.actions';
import { SubscriptionService } from '@services/subscription.service';
import { State } from '@state/articles/editor/reducers/editor.reducer';
import { UpdateArticle, CreateArticle, DeleteArticle } from '@state/articles/editor/actions/editor.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnDestroy {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  article: AppArticle;
  articleForm: FormGroup;

  constructor(
    private store: Store<State>,
    public chips: ChipsInputService,
    private subs: SubscriptionService,
    private snackbar: MatSnackBar
  ) {
    this.store.dispatch(new LoadSingleArticle({ withImage: false }));
    this.store
      .select('articleEditor', 'isLoading')
      .pipe(takeUntil(this.subs.unsubscribe$))
      .subscribe({
        next: (isLoading) => {
          if (!this.articleForm) return;
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
        take(1),
        takeUntil(this.subs.unsubscribe$)
      )
      .subscribe({
        next: (article) => {
          this.article = {} as any;
          Object.assign(this.article, article);
          this.articleForm = new FormGroup({
            title: new FormControl(article.title, [Validators.required, Validators.maxLength(35)]),
            content: new FormControl(article.content, [Validators.required]),
            tags: new FormControl(article.tags),
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
    this.snackbar
      .open('Sind Sie sich sicher?', 'LÖSCHEN', { duration: 5000 })
      .afterDismissed()
      .pipe(
        tap((res) => {
          console.log('asdf');
          if (res.dismissedByAction) {
            this.store.dispatch(new DeleteArticle({ article: this.article }));
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}

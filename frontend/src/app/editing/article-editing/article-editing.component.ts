import { Component, OnDestroy, ViewContainerRef } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

import { Article, ShallowArticle, ImageMetadata } from 'src/app/interfaces';
import { ImagesGQL } from 'src/app/GraphQL/query-services/all-images-gql.service';
import { UpdateArticleGQL } from 'src/app/GraphQL/mutation-services/article/updateArticle-gql.service';
import { NewArticleGQL } from 'src/app/GraphQL/mutation-services/article/newArticle-gql.service';
import { ShallowArticlesGQL } from 'src/app/GraphQL/query-services/articles/all-articles-shallow-gql.service';
import { DeleteArticleGQL } from 'src/app/GraphQL/mutation-services/article/deleteArticle-gql.service';
import { PopupService } from 'src/app/popup/popup.service';
import { ActivatedRoute } from '@angular/router';
import { ShallowArticleGQL } from 'src/app/GraphQL/query-services/articles/article-shallow.service';

@Component({
  selector: 'app-article-editing',
  templateUrl: './article-editing.component.html',
  styleUrls: ['./article-editing.component.scss']
})
export class ArticleEditingComponent implements OnDestroy {
  list: Observable<{ _id: string; value: string }[]>;
  private subs: Subscription[] = [];

  public selectedArticle: ShallowArticle = {
    _id: undefined,
    title: '',
    content: '',
    images: [],
    date: 0
  };
  // public articles: Observable<ShallowArticle[]>;
  public images: Observable<ImageMetadata[]>;

  constructor(
    private route: ActivatedRoute,
    private articleGql: ShallowArticleGQL,
    private articlesGql: ShallowArticlesGQL,
    private imagesGql: ImagesGQL,
    private updateArticleGql: UpdateArticleGQL,
    private newArticleGql: NewArticleGQL,
    private deleteArticleGql: DeleteArticleGQL,
    private popServ: PopupService,
    private container: ViewContainerRef
  ) {
    // get articles
    this.list = this.articlesGql.watch().valueChanges.pipe(
      map(el => el.data.articles.map(el => ({ _id: el._id, value: el.title }))),
      catchError(() => {
        this.popServ.flashPopup('could not load articles', this.container);
        return of([]);
      })
    );
    // get images
    this.images = this.imagesGql.watch().valueChanges.pipe(
      map(el => el.data.images),
      catchError(() => {
        this.popServ.flashPopup('could not load images', this.container);
        return of([]);
      })
    );
    // get selected Article
    this.subs.push(
      this.route.paramMap.subscribe({
        next: params => {
          const id = params.get('id');
          if (id) {
            this.subs.push(
              this.articleGql
                .watch({ _id: id })
                .valueChanges.pipe(take(1))
                .subscribe({
                  next: result => {
                    this.selectedArticle = {
                      _id: result.data.article._id,
                      title: result.data.article.title,
                      content: result.data.article.content,
                      images: result.data.article.images,
                      date: result.data.article.date
                    };
                  },
                  error: () => this.popServ.flashPopup('could not load event', this.container)
                })
            );
          }
        }
      })
    );
  }

  public saveArticle() {
    const images = this.selectedArticle.images.map(el => el._id);
    if (this.selectedArticle._id) {
      // update the article
      const { _id, date, title, content } = this.selectedArticle;
      this.subs.push(
        this.updateArticleGql.mutate({ _id, date, title, content, images }).subscribe({
          next: () => this.popServ.flashPopup('Artikel bearbeitet', this.container),
          error: () => this.popServ.flashPopup('Bearbeiten fehlgeschlagen', this.container),
          complete: () => {
            // refetch the articles, will cause the articles Observable to emit the new values
            this.articlesGql.watch().refetch();
          }
        })
      );
    } else {
      // create new article
      const { title, content } = this.selectedArticle;
      this.subs.push(
        this.newArticleGql.mutate({ date: this.getCurrentDate(), title, content, images }).subscribe({
          next: () => this.popServ.flashPopup('Artikel hinzugefügt', this.container),
          error: () => this.popServ.flashPopup('Hinzufügen fehlgeschlagen', this.container),
          complete: () => {
            // refetch the articles, will cause the articles Observable to emit the new values
            this.articlesGql.watch().refetch();
          }
        })
      );
    }
  }

  public deleteArticle() {
    if (!this.selectedArticle._id) {
      return;
    }
    this.subs.push(
      this.deleteArticleGql.mutate({ _id: this.selectedArticle._id }).subscribe({
        next: () => this.popServ.flashPopup('Artikel gelöscht', this.container),
        error: () => this.popServ.flashPopup('Löschen fehlgeschlagen', this.container),
        complete: () => {
          // refetch the articles, will cause the articles Observable to emit the new values
          this.articlesGql.watch().refetch();
        }
      })
    );
  }

  public toggleImageInSelection(id: string) {
    // look if id of the clicked image is already in the selection
    const isInSelection = !!this.selectedArticle.images.find(el => el._id === id);
    console.log(isInSelection);
    if (isInSelection) {
      // id is already in the selection -> remove it
      this.selectedArticle.images = this.selectedArticle.images.filter(el => el._id !== id);
    } else {
      // id is not already in the selection -> add it
      this.selectedArticle.images.push({ _id: id });
    }
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  isContainingId(id: string): boolean {
    return !!this.selectedArticle.images.find(el => el._id === id);
  }

  getCurrentDate() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    return parseInt(`${year}${month > 9 ? month : '0' + month}${day > 9 ? day : '0' + day}`, 10);
  }
}

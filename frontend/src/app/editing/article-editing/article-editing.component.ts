import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Article, Image, ShallowArticle } from 'src/app/interfaces';
import { ImagesGQL } from 'src/app/GraphQL/query-services/all-images-gql.service';
import { UpdateArticleGQL } from 'src/app/GraphQL/mutation-services/updateArticle-gql.service';
import { NewArticleGQL } from 'src/app/GraphQL/mutation-services/newArticle-gql.service';
import { ShallowArticlesGQL } from 'src/app/GraphQL/query-services/all-articles-shallow-gql.service';

@Component({
  selector: 'app-article-editing',
  templateUrl: './article-editing.component.html',
  styleUrls: ['./article-editing.component.scss']
})
export class ArticleEditingComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  public selectedArticle: ShallowArticle = {
    _id: undefined,
    title: '',
    content: '',
    images: [],
    date: 0
  };
  public articles: ShallowArticle[] = [];
  public images: Image[] = [];

  constructor(
    articlesGql: ShallowArticlesGQL,
    imagesGql: ImagesGQL,
    private updateArticleGql: UpdateArticleGQL,
    private newArticleGql: NewArticleGQL
  ) {
    // get articles
    this.subs.push(
      articlesGql.watch().valueChanges.subscribe({
        next: res => (this.articles = res.data.articles),
        error: err => console.log(err)
      })
    );
    // get images
    this.subs.push(
      imagesGql.watch().valueChanges.subscribe({
        next: res => (this.images = res.data.images),
        error: err => console.log(err)
      })
    );
  }

  ngOnInit() {}

  public selectArticle(article?: Article) {
    if (article) {
      Object.assign(this.selectedArticle, article);
    } else {
      this.selectedArticle = {
        _id: undefined,
        title: '',
        content: '',
        images: [],
        date: 0
      };
    }
  }

  public saveArticle() {
    const images = this.selectedArticle.images.map(el => el._id);
    if (this.selectedArticle._id) {
      // update the article
      const { _id, date, title, content } = this.selectedArticle;
      this.subs.push(
        this.updateArticleGql.mutate({ _id, date, title, content, images }).subscribe({
          next: newArticle => console.log(newArticle.data.updateArticle)
        })
      );
    } else {
      // create new article
      const { title, content } = this.selectedArticle;
      this.subs.push(
        this.newArticleGql.mutate({ date: this.getCurrentDate(), title, content, images }).subscribe({
          next: newArticle => console.log(newArticle.data.newArticle)
        })
      );
    }
  }

  public toggleImageInSelection(index: number) {
    // look if id of the clicked image is already in the selection
    const imgIndexInSelection = this.selectedArticle.images.findIndex(img => img._id === this.images[index]._id);
    if (imgIndexInSelection < 0) {
      // id is not already in the selection -> add it
      this.selectedArticle.images.push({ _id: this.images[index]._id });
    } else {
      // id is already in the selection -> remove it
      this.selectedArticle.images.splice(imgIndexInSelection, 1);
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

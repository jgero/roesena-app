import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { Article, Image } from 'src/app/interfaces';
import gql from 'graphql-tag';
import { JsonPipe } from '@angular/common';
import { ArticlesGQL } from 'src/app/GraphQL/query-services/all-articles-gql.service';
import { ImagesGQL } from 'src/app/GraphQL/query-services/all-images-gql.service';
import { UpdateArticleGQL } from 'src/app/GraphQL/mutation-services/updateArticle-gql.service';

@Component({
  selector: 'app-article-editing',
  templateUrl: './article-editing.component.html',
  styleUrls: ['./article-editing.component.scss']
})
export class ArticleEditingComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  public selectedArticle = new BehaviorSubject<Article>({
    _id: undefined,
    title: '',
    content: '',
    images: [],
    date: 0
  });
  public articles: Article[] = [];
  public images: Image[] = [];

  // title and content are in extra variables to bind them to the input elements
  public title: string;
  public content: string;

  constructor(articlesGql: ArticlesGQL, imagesGql: ImagesGQL, private updateArticleGql: UpdateArticleGQL) {
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
    this.selectedArticle.next(
      article
        ? article
        : {
            _id: undefined,
            title: '',
            content: '',
            images: [],
            date: 0
          }
    );
    // save title and description to bind them to the input elements
    this.title = this.selectedArticle.getValue().title;
    this.content = this.selectedArticle.getValue().content;
  }

  public saveArticle() {
    if (this.selectedArticle.getValue()._id) {
      const { _id, date, title, content, images } = this.selectedArticle.getValue();
      const imageIds = images.map(el => el._id);
      this.subs.push(
        this.updateArticleGql.mutate({ _id, date, title, content, images: imageIds }).subscribe({
          next: newArticle => console.log(newArticle.data.updateArticle)
        })
      );
    } else {
      // const addArticleMutation = gql`
      //     mutation AddArticle {
      //       newArticle(
      //         date: ${getCurrentDate()},
      //         title: "${this.title}",
      //         content: "${this.content}",
      //         images: ${JSON.stringify(this.selectedArticle.getValue().images)}) {
      //         _id
      //         date
      //         title
      //         content
      //         images
      //       }
      //     }
      //   `;
      // this.subs.push(
      //   this.apollo
      //     .mutate<{ addArticle: Article }>({
      //       mutation: addArticleMutation
      //     })
      //     .subscribe({
      //       next: result => this.articles.push(result.data.addArticle)
      //     })
      // );
    }
  }

  public onSelect(index: number) {
    const newSelection = this.selectedArticle.getValue();
    // look if id of the clicked image is already in the selection
    const imgIndex = newSelection.images.findIndex(img => img._id === this.images[index]._id);
    if (imgIndex < 0) {
      // id is not already in the selection -> add it
      newSelection.images.push(this.images[index]);
    } else {
      // id is already in the selection -> remove it
      newSelection.images.splice(imgIndex, 1);
    }
    this.selectedArticle.next(newSelection);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  isContainingId(id: string): boolean {
    return !!this.selectedArticle.getValue().images.find(el => el._id === id);
  }
}

function getCurrentDate() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  return parseInt(`${year}${month > 9 ? month : '0' + month}${day > 9 ? day : '0' + day}`, 10);
}

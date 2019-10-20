import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { Article, Image } from 'src/app/interfaces';
import gql from 'graphql-tag';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-article-editing',
  templateUrl: './article-editing.component.html',
  styleUrls: ['./article-editing.component.scss']
})
export class ArticleEditingComponent implements OnInit {

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

  constructor(private apollo: Apollo) {
    const getArticleQuery = gql`
        query GetArticles {
          articles {
            _id
            date
            title
            content
            images
          }
        }
      `;
    const getImagesQuery = gql`
      query GetImages {
        images {
          _id
          image
          tags
          description
        }
      }
    `;
    this.subs.push(this.apollo.watchQuery<{ articles: Article[] }>({
      query: getArticleQuery
    }).valueChanges.subscribe({
      next: result => this.articles = result.data.articles
    }));
    this.subs.push(this.apollo.watchQuery<{ images: Image[] }>({
      query: getImagesQuery
    }).valueChanges.subscribe({
      next: result => this.images = result.data.images
    }));
  }

  ngOnInit() { }

  public selectArticle(article?: Article) {
    this.selectedArticle.next(article ? article : {
      _id: undefined,
      title: '',
      content: '',
      images: [],
      date: 0
    });
    // save title and description to bind them to the input elements
    this.title = this.selectedArticle.getValue().title;
    this.content = this.selectedArticle.getValue().content;
  }

  public saveArticle() {
    if (this.selectedArticle.getValue()._id) {
      const updateArticleMutation = gql`
          mutation UpdateArticle {
            updateArticle(
              _id: "${this.selectedArticle.getValue()._id}",
              date: ${this.selectedArticle.getValue().date},
              title: "${this.title}",
              content: "${this.content}",
              images: ${JSON.stringify(this.selectedArticle.getValue().images)}) {
              _id
              date
              title
              content
              images
            }
          }
        `;
      this.subs.push(this.apollo.mutate<{ updateArticle: Article }>({
        mutation: updateArticleMutation
      }).subscribe({
        next: result => this.articles = this.articles.map(
          el => el._id === result.data.updateArticle._id ? result.data.updateArticle : el
        )
      }));
    } else {
      const addArticleMutation = gql`
          mutation AddArticle {
            newArticle(
              date: ${getCurrentDate()},
              title: "${this.title}",
              content: "${this.content}",
              images: ${JSON.stringify(this.selectedArticle.getValue().images)}) {
              _id
              date
              title
              content
              images
            }
          }
        `;
      this.subs.push(this.apollo.mutate<{ addArticle: Article }>({
        mutation: addArticleMutation
      }).subscribe({
        next: result => this.articles.push(result.data.addArticle)
      }));
    }
  }

  public onSelect(index: number) {
    const newSelection = this.selectedArticle.getValue();
    // look if id of the clicked image is already in the selection
    const imgIndex = newSelection.images.findIndex(imgID => imgID === this.images[index]._id);
    if (imgIndex < 0) {
      // id is not already in the selection -> add it
      newSelection.images.push(this.images[index]._id);
    } else {
      // id is already in the selection -> remove it
      newSelection.images.splice(imgIndex, 1);
    }
    this.selectedArticle.next(newSelection);
  }
}

function getCurrentDate() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  return parseInt(`${year}${month > 9 ? month : '0' + month}${day > 9 ? day : '0' + day}`, 10);
}

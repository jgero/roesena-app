import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { Article } from '../interfaces';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.scss']
})
export class StartpageComponent implements OnInit, OnDestroy {

  public articles = new BehaviorSubject<Article[]>([]);
  private subs: Subscription[] = [];

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    const articleQuery = gql`
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
    this.subs.push(this.apollo.watchQuery({
      query: articleQuery
    }).valueChanges.subscribe({
      next: (result: any) => {
        if (!result.errors && result.data) {
          this.articles.next(result.data.articles);
        }
      }
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}

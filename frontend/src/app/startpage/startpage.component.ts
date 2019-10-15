import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ApolloQueryResult } from 'apollo-client';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.scss']
})
export class StartpageComponent implements OnInit {

  public articles = new BehaviorSubject<Article[]>([]);

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: gql`
      query GetArticles {
        articles {
          _id
          date
          title
          content
          images
        }
      }`
    }).valueChanges.subscribe({
      next: (result: any) => {
        if (!result.errors && result.data) {
          this.articles.next(result.data.articles);
        }
      }
    });
  }
}

interface Article {
  _id: string;
  date: number;
  title: string;
  content: string;
  images: string[];
}

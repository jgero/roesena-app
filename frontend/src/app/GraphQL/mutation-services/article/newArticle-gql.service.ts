import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../../graphql.module';
import { Article } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NewArticleGQL extends Mutation<{ newArticle: Article }> {
  public document = gql`
    mutation NewArticle($date: Int!, $title: String!, $content: String!, $images: [String]!) {
      newArticle(input: { date: $date, title: $title, content: $content, images: $images }) {
        _id
        date
        title
        content
        images {
          _id
        }
      }
    }
  `;
}

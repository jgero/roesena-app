import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../../graphql.module';
import { Article } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UpdateArticleGQL extends Mutation<{ updateArticle: Article }> {
  public document = gql`
    mutation UpdateArticle($_id: ID!, $date: Int!, $title: String!, $content: String!, $images: [String]!) {
      updateArticle(input: { _id: $_id, date: $date, title: $title, content: $content, images: $images }) {
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

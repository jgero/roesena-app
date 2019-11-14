import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { ShallowArticle } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ShallowArticleGQL extends Query<{ article: ShallowArticle }> {
  public document = gql`
    query Article($_id: ID!) {
      article(_id: $_id) {
        _id
        title
        content
        date
        images {
          _id
        }
      }
    }
  `;
}

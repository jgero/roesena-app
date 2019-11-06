import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { Article } from 'src/app/interfaces';

@Injectable({
  providedIn: GraphQLModule
})
export class ArticlesGQL extends Query<{ articles: Article[] }> {
  public document = gql`
    query Articles {
      articles {
        _id
        title
        content
        date
        images {
          _id
          image
          description
          tags
        }
      }
    }
  `;
}

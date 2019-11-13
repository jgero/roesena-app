import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { ShallowArticle } from 'src/app/interfaces';

@Injectable({
  providedIn: GraphQLModule
})
export class ShallowArticlesGQL extends Query<{ articles: ShallowArticle[] }> {
  public document = gql`
    query Articles {
      articles {
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
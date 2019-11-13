import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../../graphql.module';

@Injectable({
  providedIn: 'root'
})
export class DeleteArticleGQL extends Mutation<{ deleteArticle: boolean }> {
  public document = gql`
    mutation DeleteArticle($_id: ID!) {
      deleteArticle(_id: $_id)
    }
  `;
}

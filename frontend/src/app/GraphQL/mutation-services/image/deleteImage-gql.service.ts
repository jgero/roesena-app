import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../../graphql.module';

@Injectable({
  providedIn: 'root'
})
export class DeleteImageGQL extends Mutation<{ deleteImage: boolean }> {
  public document = gql`
    mutation DeleteImage($_id: ID!) {
      deleteImage(_id: $_id)
    }
  `;
}

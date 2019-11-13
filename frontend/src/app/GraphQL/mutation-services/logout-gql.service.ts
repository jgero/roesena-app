import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';

@Injectable({
  providedIn: 'root'
})
export class LogoutGQL extends Mutation<{ logout: boolean }> {
  public document = gql`
    mutation Logout($_id: ID!) {
      logout(_id: $_id)
    }
  `;
}

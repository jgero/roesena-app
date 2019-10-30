import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';

@Injectable({
  providedIn: GraphQLModule
})
export class ChangePwGQL extends Mutation<{ changePw: boolean }> {

  public document = gql`
    mutation ChangePw($_id: String!, $newPassword: String!) {
      changePw(input: { _id: $_id, newPassword: $newPassword })
    }
  `;

}

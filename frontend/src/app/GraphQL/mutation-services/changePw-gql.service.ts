import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';

@Injectable({
  providedIn: 'root'
})
export class ChangePwGQL extends Mutation<{ changePw: boolean }> {
  public document = gql`
    mutation ChangePw($_id: ID!, $password: String!) {
      changePw(input: { _id: $_id, password: $password })
    }
  `;
}

import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { Person } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LoginGQL extends Mutation<{ login: Person }> {
  public document = gql`
    mutation Login($username: String!, $password: String!) {
      login(input: { name: $username, password: $password }) {
        _id
        name
        authorityLevel
      }
    }
  `;
}

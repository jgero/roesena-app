import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { Person } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UpdatePersonGQL extends Mutation<{ updatePerson: Person }> {
  public document = gql`
    mutation UpdatePerson($_id: ID!, $name: String!, $authorityLevel: Int!) {
      updatePerson(input: { _id: $_id, name: $name, authorityLevel: $authorityLevel }) {
        _id
        name
        authorityLevel
      }
    }
  `;
}

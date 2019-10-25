import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { Person } from 'src/app/interfaces';

@Injectable({
  providedIn: GraphQLModule
})
export class NewPersonGQL extends Mutation<{ newPerson: Person }> {

  public document = gql`
    mutation UpdatePerson($name: String!, $authorityLevel: Int!) {
      newPerson(name: $name, authorityLevel: $authorityLevel) {
        _id
        name
        authorityLevel
      }
    }
  `;

}

import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';

@Injectable({
  providedIn: 'root'
})
export class DeletePersonGQL extends Mutation<{ deletePerson: boolean }> {
  public document = gql`
    mutation DeletePerson($_id: ID!) {
      deletePerson(_id: $_id)
    }
  `;
}

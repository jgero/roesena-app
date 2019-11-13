import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../../graphql.module';

@Injectable({
  providedIn: 'root'
})
export class DeleteEventGQL extends Mutation<{ deleteEvent: boolean }> {
  public document = gql`
    mutation DeleteEvent($_id: ID!) {
      deleteEvent(_id: $_id)
    }
  `;
}

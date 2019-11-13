import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../../graphql.module';

@Injectable({
  providedIn: 'root'
})
export class AcceptEventGQL extends Mutation<{ acceptEvent: boolean }> {
  public document = gql`
    mutation AcceptEvent($_id: ID!, $amount: Int!) {
      acceptEvent(input: { _id: $_id, amount: $amount })
    }
  `;
}

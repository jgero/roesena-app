import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { Event } from 'src/app/interfaces';

@Injectable({
  providedIn: GraphQLModule
})
export class UpdateEventGQL extends Mutation<{ updateEvent: Event }> {

  public document = gql`
    mutation UpdateEvent(
      $_id: String!,
      $title: String!,
      $description: String!,
      $startDate: Int!,
      $endDate: Int!,
      $participants: [String]!,
      $authorityGroup: Int!
    ) {
      updateEvent(input: {
        _id: $_id,
        title: $title,
        description: $description,
        startDate: $startDate,
        endDate: $endDate,
        participants: $participants,
        authorityGroup: $authorityGroup
      }) {
        _id
      title
      description
      startDate
      endDate
      participants
      accepted
      authorityGroup
      }
    }
  `;

}

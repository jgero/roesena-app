import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../../graphql.module';
import { Event } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UpdateEventGQL extends Mutation<{ updateEvent: Event }> {
  public document = gql`
    mutation UpdateEvent(
      $_id: ID!
      $title: String!
      $description: String!
      $startDate: Int!
      $endDate: Int!
      $participants: [ParticipantInputType]!
      $authorityLevel: Int!
    ) {
      updateEvent(
        input: {
          _id: $_id
          title: $title
          description: $description
          startDate: $startDate
          endDate: $endDate
          participants: $participants
          authorityLevel: $authorityLevel
        }
      ) {
        _id
        title
        description
        startDate
        endDate
        participants {
          person {
            _id
            name
            authorityLevel
          }
          amount
        }
        authorityLevel
      }
    }
  `;
}

import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../../graphql.module';
import { Event } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NewEventGQL extends Mutation<{ newEvent: Event }> {
  public document = gql`
    mutation NewEvent(
      $title: String!
      $description: String!
      $startDate: Int!
      $endDate: Int!
      $participants: [ParticipantInputType]!
      $authorityLevel: Int!
    ) {
      newEvent(
        input: {
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

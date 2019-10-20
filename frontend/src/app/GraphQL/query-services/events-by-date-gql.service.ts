import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { Event } from 'src/app/interfaces';

@Injectable({
  providedIn: GraphQLModule
})
export class EventsByDateGQL extends Query<{ events: Event[] }> {

  public document = gql`
    query GetEventsByDate($startDate: Int!, $endDate: Int!) {
      events(startDate: $startDate, endDate: $endDate) {
        _id
        title
        description
        startDate
        endDate
        participants
      }
    }
  `;

}

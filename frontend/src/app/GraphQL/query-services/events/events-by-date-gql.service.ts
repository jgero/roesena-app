import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { Event } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EventsByDateGQL extends Query<{ eventsByDate: Event[] }> {
  public document = gql`
    query GetEventsByDate($startDate: Int!, $endDate: Int!) {
      eventsByDate(input: { startDate: $startDate, endDate: $endDate }) {
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

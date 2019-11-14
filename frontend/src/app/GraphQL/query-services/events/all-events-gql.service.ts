import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { Event } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EventsGQL extends Query<{ events: Event[] }> {
  public document = gql`
    query GetAllEvents {
      events {
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
        authorityGroup
      }
    }
  `;
}

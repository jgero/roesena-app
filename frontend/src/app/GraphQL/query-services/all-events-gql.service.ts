import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { Event } from 'src/app/interfaces';

@Injectable({
  providedIn: GraphQLModule
})
export class EventsGQL extends Query<{ events: any }> {

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
          }
        }
        authorityGroup
      }
    }
  `;

}

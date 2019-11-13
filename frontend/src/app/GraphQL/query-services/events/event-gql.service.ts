import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../../graphql.module';
import { Event } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EventGQL extends Query<{ event: Event }> {
  public document = gql`
    query Event($_id: ID!) {
      event(_id: $_id) {
        _id
        title
        description
        startDate
        endDate
        authorityGroup
        participants {
          person {
            _id
            name
            authorityLevel
          }
          amount
        }
      }
    }
  `;
}

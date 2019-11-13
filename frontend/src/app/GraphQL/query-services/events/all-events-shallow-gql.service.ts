import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../../graphql.module';

@Injectable({
  providedIn: GraphQLModule
})
export class EventsShallowGQL extends Query<{ events: { _id: string; title: string }[] }> {
  public document = gql`
    query GetAllEvents {
      events {
        _id
        title
      }
    }
  `;
}
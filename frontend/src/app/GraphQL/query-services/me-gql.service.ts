import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { Person } from 'src/app/interfaces';

@Injectable({
  providedIn: GraphQLModule
})
export class MeGQL extends Query<{ me: Person }> {

  public document = gql`
    query GetSelf {
      me {
        _id
        name
        authorityLevel
      }
    }
  `;
}

import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { Person } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PersonsGQL extends Query<{ persons: Person[] }> {
  public document = gql`
    query GetAllPersons {
      persons {
        _id
        name
        authorityLevel
      }
    }
  `;
}

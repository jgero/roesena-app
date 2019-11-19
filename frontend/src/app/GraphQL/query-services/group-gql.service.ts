import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { Group } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GroupGQL extends Query<{ group: Group }> {
  public document = gql`
    query GetGroup($_id: ID!) {
      group(_id: $_id) {
        _id
        name
        members {
          _id
        }
      }
    }
  `;
}

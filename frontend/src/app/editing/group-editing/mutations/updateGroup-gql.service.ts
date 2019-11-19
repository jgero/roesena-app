import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { Group } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UpdateGroupGQL extends Mutation<{ updateGroup: Group }> {
  public document = gql`
    mutation UpdateGroup($_id: ID!, $name: String!, $members: [String]!) {
      updateGroup(input: { _id: $_id, name: $name, members: $members }) {
        _id
      }
    }
  `;
}

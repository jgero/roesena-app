import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { Group } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NewGroupGQL extends Mutation<{ newGroup: Group }> {
  public document = gql`
    mutation NewGroup($name: String!, $members: [String]!) {
      newGroup(input: { name: $name, members: $members }) {
        _id
      }
    }
  `;
}

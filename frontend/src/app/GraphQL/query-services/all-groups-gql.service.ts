import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { Group } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GroupsGQL extends Query<{ groups: Group[] }> {
  public document = gql`
    query GetAllGroups {
      groups {
        _id
        name
      }
    }
  `;
}

import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class DeleteGroupGQL extends Mutation<{ deleteGroup: boolean }> {
  public document = gql`
    mutation DeleteGroup($_id: ID!) {
      deleteGroup(_id: $_id)
    }
  `;
}

import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../../graphql.module';
import { Image } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UpdateImageGQL extends Mutation<{ updateImage: Image }> {
  public document = gql`
    mutation UpdateImage($_id: ID!, $description: String!, $data: String!, $tags: [String]!) {
      updateImage(input: { _id: $_id, description: $description, data: $data, tags: $tags }) {
        _id
      }
    }
  `;
}

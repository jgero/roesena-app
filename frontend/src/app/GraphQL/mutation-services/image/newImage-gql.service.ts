import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../../graphql.module';
import { Image } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NewImageGQL extends Mutation<{ newImage: Image }> {
  public document = gql`
    mutation NewImage($description: String!, $data: String!, $tags: [String]!) {
      newImage(input: { description: $description, data: $data, tags: $tags }) {
        _id
      }
    }
  `;
}

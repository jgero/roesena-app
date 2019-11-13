import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { Image } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ImageGQL extends Query<{ image: Image }> {
  public document = gql`
    query Image($_id: ID!) {
      image(_id: $_id) {
        _id
        data
        description
        tags
      }
    }
  `;
}

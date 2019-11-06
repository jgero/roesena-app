import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { Image } from 'src/app/interfaces';

@Injectable({
  providedIn: GraphQLModule
})
export class ImagesGQL extends Query<{ images: Image[] }> {
  public document = gql`
    query Images {
      images {
        _id
        image
        description
        tags
      }
    }
  `;
}

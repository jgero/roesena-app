import { Injectable } from '@angular/core';

import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

import { GraphQLModule } from '../graphql.module';
import { ImageMetadata } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ImagesGQL extends Query<{ images: ImageMetadata[] }> {
  public document = gql`
    query Images {
      images {
        _id
        description
        tags
      }
    }
  `;
}

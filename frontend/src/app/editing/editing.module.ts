import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '../shared/shared.module';
import { GraphQLModule } from '../GraphQL/graphql.module';

import { EditingRouting } from './editing-routing.module';
import { EditingComponent } from './editing.component';
import { PersonEditingComponent } from './person-editing/person-editing.component';
import { EventEditingComponent } from './event-editing/event-editing.component';
import { ArticleEditingComponent } from './article-editing/article-editing.component';
import { ImageEditingComponent } from './image-editing/image-editing.component';
import { ImageCardComponent } from './image-editing/image-card/image-card.component';
import { EditCardComponent } from './image-editing/edit-card/edit-card.component';

@NgModule({
  declarations: [
    EditingComponent,
    PersonEditingComponent,
    EventEditingComponent,
    ArticleEditingComponent,
    ImageEditingComponent,
    ImageCardComponent,
    EditCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    EditingRouting,
    SharedModule,
    GraphQLModule
  ]
})
export class EditingModule { }

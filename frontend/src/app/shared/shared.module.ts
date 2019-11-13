import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SearchComponent } from './components/search/search.component';
import { TagComponent } from './components/tag/tag.component';
import { ImageComponent } from './components/image/image.component';
import { SafeURLPipe } from './safe-url.pipe';
import { HoverableDirective } from './hoverable.directive';
import { GraphQLModule } from '../GraphQL/graphql.module';
import { ButtonComponent } from './components/button/button.component';
import { AuthDropdownComponent } from './components/auth-dropdown/auth-dropdown.component';

const exports = [
  SafeURLPipe,
  HoverableDirective,
  SearchComponent,
  TagComponent,
  ImageComponent,
  ButtonComponent,
  AuthDropdownComponent
];

@NgModule({
  declarations: [...exports],
  imports: [CommonModule, FormsModule, GraphQLModule],
  exports: [...exports],
  providers: []
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SearchComponent } from './components/search/search.component';
import { TagComponent } from './components/tag/tag.component';
import { ImageComponent } from './components/image/image.component';
import { SafeURLPipe } from './safe-url.pipe';
import { HoverableDirective } from './hoverable.directive';

const exports = [
  SafeURLPipe,
  HoverableDirective,
  SearchComponent,
  TagComponent,
  ImageComponent
];

@NgModule({
  declarations: [
    ...exports
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    ...exports
  ],
  providers: []
})
export class SharedModule { }

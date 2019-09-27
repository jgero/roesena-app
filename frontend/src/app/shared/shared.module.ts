import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchComponent } from './components/search/search.component';
import { SafeURLPipe } from './safe-url.pipe';
import { TagComponent } from './components/tag/tag.component';
import { ImageComponent } from './components/image/image.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';

const components = [
  SearchComponent,
  TagComponent,
  ImageComponent,
  FooterComponent
];

@NgModule({
  declarations: [
    SafeURLPipe,
    ...components
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    SafeURLPipe,
    ...components
  ],
  providers: []
})
export class SharedModule { }

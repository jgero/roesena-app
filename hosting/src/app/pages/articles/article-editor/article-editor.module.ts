import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MarkdownViewerModule } from '@shared/markdown-viewer/markdown-viewer.module';
import { ConvertersModule } from '@shared/converters/converters.module';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { StoreModule } from '@ngrx/store';
import * as fromEditor from '@state/articles/editor/reducers/editor.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EditorEffects } from '@state/articles/editor/effects/editor.effects';

import { EditorComponent } from './editor.component';
import { ArticleEditorRoutingModule } from './article-editor-routing.module';

@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MarkdownViewerModule,
    ConvertersModule,
    MatToolbarModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    StoreModule.forFeature(fromEditor.editorFeatureKey, fromEditor.reducer),
    EffectsModule.forFeature([EditorEffects]),
    ArticleEditorRoutingModule,
  ],
})
export class ArticleEditorModule {}

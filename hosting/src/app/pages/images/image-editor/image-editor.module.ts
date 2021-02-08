import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageEditorRoutingModule } from './image-editor-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromImage from '../../../state/images/editor/reducers/image.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ImageEffects } from '../../../state/images/editor/effects/image.effects';
import { EditorComponent } from './editor.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FiltersModule } from '@shared/filters/filters.module';

@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    ImageEditorRoutingModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    FiltersModule,
    StoreModule.forFeature(fromImage.imageFeatureKey, fromImage.reducer),
    EffectsModule.forFeature([ImageEffects]),
  ],
})
export class ImageEditorModule {}

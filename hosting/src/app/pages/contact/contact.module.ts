import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { StoreModule } from '@ngrx/store';
import * as fromContact from '../../state/contact/reducers/contact.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ContactEffects } from '../../state/contact/effects/contact.effects';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { HeadingsModule } from '@shared/headings/headings.module';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContactRoutingModule,
    HeadingsModule,
    MatButtonModule,
    MatRadioModule,
    MatTooltipModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    StoreModule.forFeature(fromContact.contactFeatureKey, fromContact.reducer),
    EffectsModule.forFeature([ContactEffects]),
  ],
})
export class ContactModule {}

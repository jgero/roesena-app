import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { GardenComponent } from './garden/garden.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { CardsModule } from 'src/app/shared/cards/cards.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { CommonComponent } from './common/common.component';
import { MarkdownViewerModule } from 'src/app/shared/markdown-viewer/markdown-viewer.module';
import { StoreModule } from '@ngrx/store';
import * as fromContent from '../../state/groups/reducers/content.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ContentEffects } from '../../state/groups/effects/content.effects';

@NgModule({
  declarations: [GardenComponent, CommonComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    MatToolbarModule,
    MatGridListModule,
    CardsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MarkdownViewerModule,
    StoreModule.forFeature(fromContent.contentFeatureKey, fromContent.reducer),
    EffectsModule.forFeature([ContentEffects]),
  ],
})
export class GroupsModule {}

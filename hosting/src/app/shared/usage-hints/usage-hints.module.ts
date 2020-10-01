import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsageHintPopupComponent } from './usage-hint-popup/usage-hint-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsageHintPopupComponent],
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatDialogModule],
  exports: [UsageHintPopupComponent],
})
export class UsageHintsModule {}

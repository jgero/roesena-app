import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmPopupComponent } from './delete-confirm-popup/delete-confirm-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DeleteConfirmPopupComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [DeleteConfirmPopupComponent],
})
export class DeleteConfirmModule {}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm-popup',
  templateUrl: './delete-confirm-popup.component.html',
  styleUrls: ['./delete-confirm-popup.component.scss'],
})
export class DeleteConfirmPopupComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string }) {}
  ngOnInit(): void {}
}

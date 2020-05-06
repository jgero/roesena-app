import { AppElement } from '../interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { EventEmitter, Output, Input } from '@angular/core';

export abstract class Card {
  @Input()
  data: AppElement;
  @Input()
  navigateOnTagClick = true;
  @Output()
  tagClick = new EventEmitter<string>();

  constructor(public auth: AuthService, public router: Router, public routeBase: string) {}

  canEdit(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.id === this.data.ownerId || user.groups.includes('admin'));
  }

  onTagClick(tag: string) {
    if (this.navigateOnTagClick) {
      this.router.navigate([this.routeBase, 'overview', tag]);
    } else {
      this.tagClick.emit(tag);
    }
  }
}

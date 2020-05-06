import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AppImage } from '../utils/interfaces';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class EmptyImageResolver implements Resolve<AppImage> {
  constructor(private auth: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AppImage> | Promise<AppImage> | AppImage {
    const user = this.auth.$user.getValue();
    return {
      id: '',
      ownerId: user.id,
      ownerName: user.name,
      tags: [],
      created: new Date(),
    };
  }
}

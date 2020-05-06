import { AppElement } from '../interfaces';
import { AuthService } from 'src/app/services/auth.service';

export abstract class Details {
  constructor(public auth: AuthService) {}

  canEdit(appEl: AppElement): boolean {
    const user = this.auth.$user.getValue();
    return user && (user.id === appEl.ownerId || user.groups.includes('admin'));
  }
}

import { appElement } from "../interfaces";
import { AuthService } from "src/app/services/auth.service";

export abstract class Card {
  data: appElement;

  constructor(public auth: AuthService) {}

  canEdit(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.id === this.data.ownerId || user.groups.includes("admin"));
  }
}

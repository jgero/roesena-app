import { OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { appElement, appElementDAL } from "../interfaces";
import { AuthService } from "src/app/services/auth.service";

export abstract class Overview implements OnInit {
  $data: Observable<appElement[]>;
  get cols(): number {
    return Math.ceil(window.innerWidth / 500);
  }

  constructor(public DAO: appElementDAL, public auth: AuthService) {}

  ngOnInit() {
    this.initDataStream();
  }

  initDataStream() {
    this.$data = this.DAO.getAll();
  }

  canCreate(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.groups.includes("Autor") || user.groups.includes("admin"));
  }
}

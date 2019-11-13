import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ListService } from './list.service';

@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.scss']
})
export class EditingComponent {
  constructor(public listSrv: ListService, private router: Router) {}

  select(id: string | null) {
    const mode = this.router.url.split('/')[2];
    if (id) {
      this.router.navigate(['edit', mode, id]);
    } else {
      this.router.navigate(['edit', mode]);
    }
  }
}

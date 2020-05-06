import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageDalService } from 'src/app/services/DAL/image-dal.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  $applicationURL: Observable<string>;
  constructor(DAO: ImageDalService) {
    this.$applicationURL = DAO.getStaticRscURL('RoeSeNa_Anmeldung_Mitgliedschaft.pdf');
  }
}

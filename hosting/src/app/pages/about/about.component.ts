import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlLoaderService } from '@services/url-loader.service';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  $applicationURL: Observable<string>;
  constructor(urlLoader: UrlLoaderService, seo: SeoService) {
    this.$applicationURL = urlLoader.getStaticRscURL('RoeSeNa_Anmeldung_Mitgliedschaft.pdf');
    seo.setTags('Impressum', 'Impressum der Röhlinger Sechtanarren', null, '/about');
  }
}

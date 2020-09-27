import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlLoaderService } from '@services/url-loader.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  $applicationURL: Observable<string>;
  constructor(urlLoader: UrlLoaderService, titleService: Title) {
    this.$applicationURL = urlLoader.getStaticRscURL('RoeSeNa_Anmeldung_Mitgliedschaft.pdf');
    titleService.setTitle('RöSeNa - Impressum');
  }
}

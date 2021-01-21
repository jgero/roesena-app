import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const urlPrefix = 'https://xn--rsena-jua.de';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private metaService: Meta, private titleService: Title) {
    this.titleService.setTitle('Röhlinger Sechtanarren');
    this.metaService.addTags([
      { property: 'og:title', content: 'Röhlinger Sechtanarren' },
      { property: 'og:description', content: 'Homepage der Röhlinger Sechtanarren (RöSeNa)' },
      { property: 'og:url', content: urlPrefix },
      { property: 'og:image', content: urlPrefix + '/assets/icons/startpage-logo.webp' },
    ]);
  }

  public setTags(
    title = 'Röhlinger Sechtanarren',
    description: string | undefined,
    image = `${urlPrefix}/assets/icons/startpage-logo.webp`,
    url: string
  ) {
    this.titleService.setTitle(`${title} - RöSeNa`);
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:url', content: urlPrefix + url });
    if (description) {
      this.metaService.updateTag({ property: 'og:description', content: description });
    } else {
      this.metaService.removeTag("property='og:description'");
    }
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserService {
  constructor() {}

  reload() {
    location.reload();
  }

  scrollToTop() {
    // in mobile mode the element with this id is the scrolling container
    // in desktop mode the root element is the scrolling container
    const scrollconatiner = document.getElementById('scrollableContent') || window;
    scrollconatiner.scrollTo(0, 0);
  }
}

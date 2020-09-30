import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/basePages/reducers/base.reducer';
import { LoadHelpArticle } from '@state/basePages/actions/base.actions';
import { SubscriptionService } from '@services/subscription.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnDestroy, OnInit {
  $textData = this.store.select('base', 'helpArticle');

  constructor(private store: Store<State>, private subs: SubscriptionService, titleService: Title) {
    this.store.dispatch(new LoadHelpArticle());
    titleService.setTitle('RöSeNa - Hilfe');
  }

  ngOnInit() {
    if (window.location.hash) {
      this.navigateToSection(window.location.hash);
    }
  }

  navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}

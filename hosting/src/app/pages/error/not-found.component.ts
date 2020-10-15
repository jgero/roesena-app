import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { State } from '@state/basePages/reducers/base.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  code: Observable<string> = this.store.select('router').pipe(map((routerState) => routerState.state.params.code));
  constructor(private location: Location, private router: Router, titleService: Title, private store: Store<State>) {
    titleService.setTitle('RöSeNa - Fehler');
  }

  public goBack() {
    if ((this.location.getState() as any).navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigate(['']);
    }
  }
}

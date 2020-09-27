import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatToolbarModule, MatButtonModule, RouterTestingModule],
      declarations: [NotFoundComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to startpage when needed', () => {
    location.replaceState('/asdf', '', { navigationId: 1 });
    const spy = spyOn(router, 'navigate');
    component.goBack();
    expect(spy).toHaveBeenCalled();
  });

  it('should go location back when possible', () => {
    location.replaceState('/asdf', '', { navigationId: 3 });
    const spy = spyOn(location, 'back');
    component.goBack();
    expect(spy).toHaveBeenCalled();
  });
});

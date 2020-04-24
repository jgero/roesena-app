import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WildesHeerComponent } from './wildes-heer.component';

describe('WildesHeerComponent', () => {
  let component: WildesHeerComponent;
  let fixture: ComponentFixture<WildesHeerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WildesHeerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WildesHeerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

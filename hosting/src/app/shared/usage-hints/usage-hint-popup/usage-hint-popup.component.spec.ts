import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageHintPopupComponent } from './usage-hint-popup.component';

describe('UsageHintPopupComponent', () => {
  let component: UsageHintPopupComponent;
  let fixture: ComponentFixture<UsageHintPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsageHintPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageHintPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantChipComponent } from './participant-chip.component';

describe('ParticipantChipComponent', () => {
  let component: ParticipantChipComponent;
  let fixture: ComponentFixture<ParticipantChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

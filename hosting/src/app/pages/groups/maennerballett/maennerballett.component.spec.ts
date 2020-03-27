import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaennerballettComponent } from './maennerballett.component';

describe('MaennerballettComponent', () => {
  let component: MaennerballettComponent;
  let fixture: ComponentFixture<MaennerballettComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaennerballettComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaennerballettComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

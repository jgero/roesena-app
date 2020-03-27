import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandjoggalaComponent } from './brandjoggala.component';

describe('BrandjoggalaComponent', () => {
  let component: BrandjoggalaComponent;
  let fixture: ComponentFixture<BrandjoggalaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandjoggalaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandjoggalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

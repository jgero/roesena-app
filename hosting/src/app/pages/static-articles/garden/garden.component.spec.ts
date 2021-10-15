import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';

import { GardenComponent } from './garden.component';
import { testingRoutes } from 'src/app/testing';

describe('GardenComponent', () => {
  let component: GardenComponent;
  let fixture: ComponentFixture<GardenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(testingRoutes), MatTabsModule],
      declarations: [GardenComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GardenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

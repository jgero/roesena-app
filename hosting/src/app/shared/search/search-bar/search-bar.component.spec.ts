import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarComponent } from './search-bar.component';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { ChipsInputService } from 'src/app/services/chips-input.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  const chipsStub = { addItem: (a: any, b: any) => {}, removeItem: (a: any, b: any) => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatInputModule, ReactiveFormsModule, MatChipsModule, MatButtonModule, MatIconModule],
      declarations: [SearchBarComponent],
      providers: [{ provide: ChipsInputService, useValue: chipsStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    component.searchStrings = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

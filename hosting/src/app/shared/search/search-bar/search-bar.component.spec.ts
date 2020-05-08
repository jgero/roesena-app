import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarComponent } from './search-bar.component';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { ChipsInputService } from 'src/app/services/chips-input.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AutocompleteService } from 'src/app/services/autocomplete.service';
import { BehaviorSubject } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ConvertersModule } from '../../converters/converters.module';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  const chipsStub = { addItem: (a: any, b: any) => {}, removeItem: (a: any, b: any) => {} };
  const autoStub = { $existingTags: new BehaviorSubject([]) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatInputModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
        MatAutocompleteModule,
        ConvertersModule,
      ],
      declarations: [SearchBarComponent],
      providers: [
        { provide: ChipsInputService, useValue: chipsStub },
        { provide: AutocompleteService, useValue: autoStub },
      ],
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('pretraga s odmakom u vremenu', (done) => {
    spyOn(component.searchChange, 'emit');

    component.searchTerm = 'debounce test';
    component.onSearch();

    setTimeout(() => {
      expect(component.searchChange.emit).toHaveBeenCalledWith('debounce test');
      done();
    }, 400);
  }
  );



});
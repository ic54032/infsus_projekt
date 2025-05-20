import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigaDetailsDialogComponent } from './liga-details-dialog.component';

describe('LigaDetailsDialogComponent', () => {
  let component: LigaDetailsDialogComponent;
  let fixture: ComponentFixture<LigaDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigaDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LigaDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

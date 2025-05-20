import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigaEditDialogComponent } from './liga-edit-dialog.component';

describe('LigaEditDialogComponent', () => {
  let component: LigaEditDialogComponent;
  let fixture: ComponentFixture<LigaEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigaEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LigaEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecFormDialogComponent } from './mec-form-dialog.component';

describe('MecFormDialogComponent', () => {
  let component: MecFormDialogComponent;
  let fixture: ComponentFixture<MecFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MecFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MecFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
